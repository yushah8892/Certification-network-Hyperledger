// Setting for Hyperledger Fabric
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const SETTING = require('../../setting');
const yaml = require('js-yaml');
const fs = require('fs');
const ccpPath = yaml.safeLoad(fs.readFileSync(path.resolve(SETTING.APPL_ROOT_PATH, 'gateway/networkConnection.yaml'), 'utf8'));
const gateway = new Gateway();

class CertificateController {

    static async getNetwork() {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(SETTING.APPL_ROOT_PATH, '/identity/iit');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1@iit.certification-network.com');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            await gateway.connect(ccpPath, { wallet, identity: 'user1@iit.certification-network.com', discovery: { enabled: true, asLocalhost: true } });
            console.log('Successfully connected to gateway.')
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('certificationchannel');
            console.log('successfully get the network.');
            return network;
        } catch (error) {

            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({ error: error });

            //process.exit(1);

        }
    }
    static async issueCertificate(req, res) {
        try {

            const studentId = req.body.studentId;
            const courseId = req.body.courseId;
            const gradeReceived = req.body.gradeReceived;
            const originalHash = req.body.originalHash;

            // Get the network (channel) our contract is deployed to.
            const network = await this.getNetwork();

            // Get the contract from the network.
            const contract = network.getContract('certnet', 'org.certification-network.certnet');

            const result = await contract.submitTransaction('issueCertificate', studentId, courseId, gradeReceived, originalHash);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            res.status(200).json({ response: result.toString() });

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({ error: error });
            //process.exit(1);
        }
    }

    static async verifyCertificate(req, res) {
        try {
            const studentId = req.query.studentId;
            const courseId = req.query.courseId;
            const currentHash = req.query.currentHash;

            // Get the network (channel) our contract is deployed to.
            const network = await this.getNetwork();


            // Get the contract from the network.
            const contract = network.getContract('certnet', 'org.certification-network.certnet');

            await contract.addContractListener('verifyCertificate', 'createStudent', (err, event, blkNum, txid, status, options) => {
                console.log('event received', status, event, blkNum, txid);
                if (err) {
                    this.emit('error', err);
                } else if (status && status === 'VALID') {
                    console.log("payload ", event.payload.toString());
                }
            });


            const result = await contract.evaluateTransaction('verifyCertificate', studentId, courseId, currentHash);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            res.status(200).json({ response: result.toString() });

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({ error: error });
            //process.exit(1);
        }
    }


}

module.exports = CertificateController;