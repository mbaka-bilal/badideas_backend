import DareInterface from "../../../models/interface/dare_interface";

abstract class DareService {
    abstract getRandomDare(): Promise<DareInterface>;
    abstract getAllDares(): Promise<DareInterface[]>;
    abstract filterDares(title?: string | undefined | null, description?: string | undefined | null): Promise<DareInterface[]>;
    abstract addNewDare(dare: DareInterface): Promise<DareInterface>;
    abstract removeDare(dareId: string): Promise<string>;
    abstract editDare(dare: DareInterface): Promise<DareInterface>;
}

export default DareService;