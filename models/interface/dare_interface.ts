export interface DareInterface {
    id: string;
    title: string;
    description: string;
    index: number;
    difficulty: number; // 1-3 (easy, medium, hard)
    deleted: boolean;
    createdAt: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    titleKeywords?: string[] | null;
    descriptionKeywords?: string[] | null;
}

export default DareInterface;