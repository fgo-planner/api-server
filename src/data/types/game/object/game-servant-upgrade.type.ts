/**
 * Material and QP cost for performing servant upgrades.
 */
export type GameServantUpgrade = {

    /**
     * The cost of the upgrade in QP.
     */
    cost: number;

    /**
     * Materials required for the upgrade.
     */
    materials: { gameId: number; quantity: number }[];

}