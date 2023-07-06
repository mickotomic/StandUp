import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterOperator, FilterSuffix, PaginateQuery, Paginated, paginate } from "nestjs-paginate";
import { Summary } from "src/entities/summary.entity";
import { Not, Repository } from "typeorm";



@Injectable()
export class SummaryService {
    constructor(
        @InjectRepository(Summary)
        private summaryRepository: Repository<Summary>
    ) {}


async getSummaryHistory(workspaceId: number, query: PaginateQuery): Promise<Paginated<Summary>> {
    return paginate(query, this.summaryRepository,
    {
        sortableColumns:[],
        nullSort: 'first',
        defaultSortBy: [['id' , 'DESC']],
        searchableColumns: ['workspace', 'tasks'],
        select: ['id', 'workspace', 'tasks', 'tasksCompleted', 'tasksDue', 'absentUsers' ],
        where: {workspace:{id: workspaceId} }
    })
  
}

    }