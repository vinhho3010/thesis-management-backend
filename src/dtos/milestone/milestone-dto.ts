export interface milestoneCreateDto {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    class: string;
    isSendMail?: boolean;
}