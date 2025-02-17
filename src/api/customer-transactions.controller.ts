import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CustomerTransactionService } from "../application/customer-transaction.service";

type ListCustomerParam = {
    id: string
}
export class CustomerTransactionController {

    constructor(private server: FastifyInstance, private customerTransactionService: CustomerTransactionService) {
        this.server.get<{Params:ListCustomerParam}>("/customers/:id/transactions", this.listCustomerTransactions.bind(this))
    }

    async listCustomerTransactions(request: FastifyRequest<{Params:ListCustomerParam}>, reply: FastifyReply) {
        const { id } = request.params
        /** TODO: validate, convert id */
        const transactions = await this.customerTransactionService.getTransactionsByCustomer(Number(id))
        return {data: transactions}
    }
}