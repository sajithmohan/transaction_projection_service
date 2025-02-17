
import { TestServer } from './test-server';
import nock from 'nock'
describe('customer relations', () => {
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
            url: '/customers/1/relations'
        })
        const relations = response?.json().data
        expect(relations !== undefined)
        expect(relations.length === 0)
        await testServer.stop()
    });
    test('customer with same device related', async () => {
        const testServer = new TestServer()
        const endpoint = process.env.TRANSACTIONS_API_ENDPOINT as string
        nock(endpoint)
            .get('')
            .reply(200, [
                {
                    transactionId: 15,
                    authorizationCode: "F10007",
                    transactionDate: "2022-09-06T11:05:00+00:00",
                    customerId: 3,
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
                    transactionId: 17,
                    authorizationCode: "F10008",
                    transactionDate: "2022-09-06T13:05:00+00:00",
                    customerId: 4,
                    transactionType: "P2P_SEND",
                    transactionStatus: "SETTLED",
                    description: "Transfer to Weoy",
                    amount: -10000,
                    metadata: {
                        relatedTransactionId: 18,
                        deviceId: "F210200"
                    }
                }
            ])
        await testServer.start()

        const response = await testServer.instance?.inject({
            method: 'GET',
            url: '/customers/3/relations'
        })
        const relations = response?.json().data
        expect(relations !== undefined)
        expect(relations.length === 1)
        expect(relations[0].relatedCustomerId === 4)

        await testServer.stop()
    });
    test('P2P transfer makes customers related', async () => {
        const testServer = new TestServer()
        const endpoint = process.env.TRANSACTIONS_API_ENDPOINT as string
        nock(endpoint)
            .get('')
            .reply(200, [
                {
                    transactionId: 33,
                    authorizationCode: "F10016",
                    transactionDate: "2022-11-10T13:05:00+00:00",
                    customerId: 9,
                    transactionType: "P2P_SEND",
                    transactionStatus: "SETTLED",
                    description: "Transfer to Bob",
                    amount: -30,
                    metadata: {
                        relatedTransactionId: 34,
                        deviceId: "A342011"
                    }
                },
                {
                    transactionId: 34,
                    authorizationCode: "F10016",
                    transactionDate: "2022-11-10T13:05:00+00:00",
                    customerId: 8,
                    transactionType: "P2P_RECEIVE",
                    transactionStatus: "SETTLED",
                    description: "Transfer from Alice",
                    amount: 30,
                    metadata: {
                        relatedTransactionId: 33
                    }
                }
            ])
        await testServer.start()

        const response1 = await testServer.instance?.inject({
            method: 'GET',
            url: '/customers/9/relations'
        })
        const response2 = await testServer.instance?.inject({
            method: 'GET',
            url: '/customers/9/relations'
        })
        const relations = response1?.json().data
        expect(relations !== undefined)
        expect(relations.length === 1)
        expect(relations[0].relatedCustomerId === 8)
        const relations1 = response2?.json().data
        expect(relations1 !== undefined)
        expect(relations1.length === 1)
        expect(relations1[0].relatedCustomerId === 9)
        await testServer.stop()
    });
});

