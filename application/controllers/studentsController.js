// Setting for Hyperledger Fabric
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const SETTING  = require('../../setting');
const yaml = require('js-yaml');
const fs = require('fs');
const ccpPath = yaml.safeLoad(fs.readFileSync(path.resolve(SETTING.APPL_ROOT_PATH,  'gateway/networkConnection.yaml'), 'utf8'));

class StudentController {

    static async createStudents(req, res) {
        const {studentId,name,email}= req.body;
        //console.log(studentId);
       
        try {

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(SETTING.APPL_ROOT_PATH ,'/identity/iit');
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
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: 'user1@iit.certification-network.com', discovery: { enabled: true, asLocalhost: true } });
            console.log('Successfully connected to gateway.')
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('certificationchannel'); 
            console.log('successfully get the network.');
            // Get the contract from the network.
            const contract = network.getContract('certnet','org.certification-network.certnet');

            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.submitTransaction('createStudent', studentId, name, email);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            res.status(200).json({ response: result.toString() });

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({ error: error });
            process.exit(1);
        }
        
    }

    static async getStudent(req, res) {

        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(SETTING.APPL_ROOT_PATH, '/identity/iit');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            console.log(req.params);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1@iit.certification-network.com');
            if (!userExists) {
                console.log('An identity for the user "user1@iit.certification-network.com" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: 'user1@iit.certification-network.com', discovery: { enabled: true, asLocalhost: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('certificationchannel');

            // Get the contract from the network.
            const contract = network.getContract('certnet','org.certification-network.certnet');

            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('getStudent', req.params.id);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            res.status(200).json({ response: result.toString() });

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({ error: error });
            process.exit(1);
        }
    }


}

module.exports = StudentController;