function filterItemsByBasePrice(
    items: Item[],
    lowerLimit: number,
    upperLimit: number,
): Item[] {
    return items.filter((item) =>
        item.basePrice > lowerLimit && item.basePrice < upperLimit
    );
}

function initializeTables(
    maxItemCount: number,
    maxBasePrice: number,
): [number[][], number[][]] {
    const fleaCostTable: number[][] = Array(maxItemCount + 1).fill(null).map(
        () => Array(maxBasePrice + 1).fill(Infinity),
    );
    const backtrack: number[][] = Array(maxItemCount + 1).fill(null).map(() =>
        Array(maxBasePrice + 1).fill(-1)
    );
    fleaCostTable[0][0] = 0;
    return [fleaCostTable, backtrack];
}

function fillDPTable(
    filteredItems: Item[],
    fleaCostTable: number[][],
    backtrack: number[][],
    maxItemCount: number,
    maxBasePrice: number,
): void {
    for (let itemCount = 1; itemCount <= maxItemCount; itemCount++) {
        for (let itemIndex = 0; itemIndex < filteredItems.length; itemIndex++) {
            const { basePrice, lastLowPrice } = filteredItems[itemIndex];
            for (
                let totalBasePrice = maxBasePrice;
                totalBasePrice >= basePrice;
                totalBasePrice--
            ) {
                const previousCost =
                    fleaCostTable[itemCount - 1][totalBasePrice - basePrice];
                if (
                    previousCost + lastLowPrice <
                        fleaCostTable[itemCount][totalBasePrice]
                ) {
                    fleaCostTable[itemCount][totalBasePrice] = previousCost +
                        lastLowPrice;
                    backtrack[itemCount][totalBasePrice] = itemIndex;
                }
            }
        }
    }
}

function findValidCombinations(
    fleaCostTable: number[][],
    minBasePrice: number,
    maxBasePrice: number,
    maxItemCount: number,
): Array<{ itemCount: number; totalBasePrice: number; fleaCost: number }> {
    const validCombinations: Array<
        { itemCount: number; totalBasePrice: number; fleaCost: number }
    > = [];
    for (let itemCount = 1; itemCount <= maxItemCount; itemCount++) {
        for (
            let totalBasePrice = minBasePrice;
            totalBasePrice <= maxBasePrice;
            totalBasePrice++
        ) {
            if (fleaCostTable[itemCount][totalBasePrice] !== Infinity) {
                validCombinations.push({
                    itemCount,
                    totalBasePrice,
                    fleaCost: fleaCostTable[itemCount][totalBasePrice],
                });
            }
        }
    }
    return validCombinations;
}

function getSelectedItems(
    filteredItems: Item[],
    chosenCombination: {
        itemCount: number;
        totalBasePrice: number;
        fleaCost: number;
    },
    backtrack: number[][],
): Item[] {
    const selectedItems: Item[] = [];
    let remainingBasePrice = chosenCombination.totalBasePrice;

    for (
        let itemCount = chosenCombination.itemCount;
        itemCount > 0;
        itemCount--
    ) {
        const itemIndex = backtrack[itemCount][remainingBasePrice];
        if (itemIndex === -1) break;

        selectedItems.push(filteredItems[itemIndex]);
        remainingBasePrice -= filteredItems[itemIndex].basePrice;
    }

    return selectedItems;
}

export default function findBestCombination(
    items: Item[],
    minBasePrice: number,
): {
    selectedItems: Item[];
    totalLastLowPrice: number;
    totalBasePrice: number;
} {
    const maxBasePrice = minBasePrice + 10000;
    const maxItemCount = 5;

    const lowerBasePriceLimit = Math.round(maxBasePrice / maxItemCount * 0.5);
    const upperBasePriceLimit = Math.round(maxBasePrice / maxItemCount * 1.5);

    const filteredItems = filterItemsByBasePrice(
        items,
        lowerBasePriceLimit,
        upperBasePriceLimit,
    );
    const [fleaCostTable, backtrack] = initializeTables(
        maxItemCount,
        maxBasePrice,
    );

    fillDPTable(
        filteredItems,
        fleaCostTable,
        backtrack,
        maxItemCount,
        maxBasePrice,
    );

    const validCombinations = findValidCombinations(
        fleaCostTable,
        minBasePrice,
        maxBasePrice,
        maxItemCount,
    );
    validCombinations.sort((a, b) => a.fleaCost - b.fleaCost);

    const chosenCombination = validCombinations[0];

    if (!chosenCombination) {
        return { selectedItems: [], totalLastLowPrice: 0, totalBasePrice: 0 };
    }

    const selectedItems = getSelectedItems(
        filteredItems,
        chosenCombination,
        backtrack,
    );

    return {
        selectedItems,
        totalLastLowPrice: chosenCombination.fleaCost,
        totalBasePrice: chosenCombination.totalBasePrice,
    };
}
