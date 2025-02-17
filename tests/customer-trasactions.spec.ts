
import { TestServer } from './test-server';
import nock from 'nock'
describe('customer transactions', () => {
    afterEach(() => {
        nock.cleanAll()
    })
    test('customer with no trasaction gets empty response', async () => {
        const testServer = new TestServer()
        const endpoint = process.env.TRANSACTIONS_API_ENDPOINT as string
        const scope = nock(endpoint)
            .get('')
            .reply(200, [])
        await testServer.start()

        const response = await testServer.instance?.inject({
            method: 'GET',
            url: '/customers/1/transactions'
        })
        const transactions = response?.json().data
        expect(transactions !== undefined)
        expect(transactions.length === 0)
        await testServer.stop()
    });

    test('customer with trasactions gets response', async () => {
        const testServer = new TestServer()
        const endpoint = process.env.TRANSACTIONS_API_ENDPOINT as string
        const scope = nock(endpoint)
            .get('')
            .reply(200, [
                {
                    transactionId: 1,
                    authorizationCode: "F10000",
                    transactionDate: "2022-09-01T11:46:42+00:00",
                    customerId: 1,
                    transactionType: "ACH_INCOMING",
                    transactionStatus: "PENDING",
                    description: "Deposit from Citibank",
                    amount: 5000,
                    metadata: {}
                }
            ])
        await testServer.start()

        const response = await testServer.instance?.inject({
            method: 'GET',
            url: '/customers/1/transactions'
        })
        const transactions = response?.json().data
        expect(transactions !== undefined)
        expect(transactions.length === 1)
        await testServer.stop()
    });

    test('related trasactions gets aggregated', async () => {
        const testServer = new TestServer()
        const endpoint = process.env.TRANSACTIONS_API_ENDPOINT as string
        const scope = nock(endpoint)
            .get('')
            .reply(200, [
                {
                    transactionId: 1,
                    authorizationCode: "F10000",
                    transactionDate: "2022-09-01T11:46:42+00:00",
                    customerId: 1,
                    transactionType: "ACH_INCOMING",
                    transactionStatus: "PENDING",
                    description: "Deposit from Citibank",
                    amount: 5000,
                    metadata: {}
                },
                {
                    transactionId: 2,
                    authorizationCode: "F10000",
                    transactionDate: "2022-09-03T15:41:42+00:00",
                    customerId: 1,
                    transactionType: "ACH_INCOMING",
                    transactionStatus: "SETTLED",
                    description: "Deposit from Citibank",
                    amount: 5000,
                    metadata: {
                        relatedTransactionId: 1
                    }
                }
            ])
        await testServer.start()

        const response = await testServer.instance?.inject({
            method: 'GET',
            url: '/customers/1/transactions'
        })
        const transactions = response?.json().data
        expect(transactions !== undefined)
        expect(transactions.length === 1)
        expect(transactions[0].timeline.length === 2)
        expect(transactions[0].timeline[0].status === 'PENDING')
        expect(transactions[0].timeline[0].transactionId === 1)
        expect(transactions[0].timeline[1].status === 'SETTLED')
        expect(transactions[0].timeline[1].transactionId === 2)
        await testServer.stop()
    });
    
    test('P2P transactions not aggregated', async () => {
        const testServer = new TestServer()
        const endpoint = process.env.TRANSACTIONS_API_ENDPOINT as string
        const scope = nock(endpoint)
            .get('')
            .reply(200, [
                {
                    transactionId: 15,
                    authorizationCode: "F10007",
                    transactionDate: "2022-09-06T11:05:00+00:00",
                    customerId: 2,
                    transactionType: "P2P_SEND",
                    transactionStatus: "SETTLED",
                    description: "Transfer to Adam",
                    amount: -10000,
                    metadata: {
                        relatedTransactionId: 16,
                        deviceId: "F210200"
                    }
                },
                {
                    transactionId: 16,
                    authorizationCode: "F10007",
                    transactionDate: "2022-09-06T11:05:00+00:00",
                    customerId: 1,
                    transactionType: "P2P_RECEIVE",
                    transactionStatus: "SETTLED",
                    description: "Transfer from Frederik",
                    amount: 10000,
                    metadata: {
                        relatedTransactionId: 15
                    }
                },
            ])
        await testServer.start()

        const response = await testServer.instance?.inject({
            method: 'GET',
            url: '/customers/1/transactions'
        })
        const transactions = response?.json().data
        expect(transactions !== undefined)
        expect(transactions.length === 1)
        expect(transactions[0].timeline.length === 1)
        expect(transactions[0].timeline[0].transactionId === 16)
        expect(transactions[0].timeline[0].status === 'SETTLED')
        await testServer.stop()
    });
})
