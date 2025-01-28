import {
  Inject,
  Injectable,
  OnModuleInit,
  Optional,
  Logger,
} from '@nestjs/common';
// import { Prisma, PrismaClient } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';

import { PRISMA_SERVICE_OPTIONS } from './constants/prisma.constants';
import { PrismaServiceOptions } from './interface/prisma-module-options';

type PrismaClientReplica = PrismaClient & {
  $replica: () => PrismaClient;
};

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit
{
  private readonly _replicaClient: PrismaClientReplica;
  private readonly self: PrismaService;
  private readonly logger = new Logger(PrismaService.name);

  constructor(
    @Optional()
    @Inject(PRISMA_SERVICE_OPTIONS)
    private readonly prismaServiceOptions: PrismaServiceOptions = {},
  ) {
    super(prismaServiceOptions.prismaOptions);

    if (this.prismaServiceOptions.middlewares) {
      this.prismaServiceOptions.middlewares.forEach((middleware) =>
        this.$use(middleware),
      );
    }

    this.self = this;
  }

  async onModuleInit() {
    if (this.prismaServiceOptions.explicitConnect) {
      await this.$connect();
    }
  }

  get replica() {
    if (!this._replicaClient) {
      return this.self;
    }
    return this._replicaClient;
  }
}
