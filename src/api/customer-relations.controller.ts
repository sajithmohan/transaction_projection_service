import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CustomerTransactionService } from "../application/customer-transaction.service";

type ListParam = {
    id: string
}
export class CustomerRelationsController {

    constructor(private server: FastifyInstance, private customerTransactionService: CustomerTransactionService) {
        this.server.get<{Params:ListParam}>("/customers/:id/relations", this.listCustomerRelations.bind(this))
    }

    async listCustomerRelations(request: FastifyRequest<{Params:ListParam}>, reply: FastifyReply) {
        const { id } = request.params
        /** TODO: validate, convert id */
        const relatedCustomers = await this.customerTransactionService.getRelatedCustomers(Number(id))
        return {data: relatedCustomers}
    }
}