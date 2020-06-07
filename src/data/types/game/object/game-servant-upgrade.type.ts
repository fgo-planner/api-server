/**
 * Material and QP cost for performing a servant upgrade.
 */
export type GameServantUpgrade = {

    /**
     * The cost of the upgrade in QP.
     */
    qp: number;

    /**
     * Materials required for the upgrade.
     */
    materials: { 

        itemId: number; 

        quantity: number;
        
    }[];

}
