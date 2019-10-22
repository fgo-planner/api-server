export type PageRequest = {
    page: number;
    size: number;
    sort: string;
    direction: 'ASC' | 'DESC';
};
