import { MigrationService } from './migration.service';
export declare class MigrationController {
    private migrationService;
    constructor(migrationService: MigrationService);
    addIsActiveToUsers(): Promise<import("mongoose").UpdateWriteOpResult>;
}
