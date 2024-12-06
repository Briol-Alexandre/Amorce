import FondAction from "@/Components/FondAction.jsx";
import React from "react";
import {usePage} from "@inertiajs/react";

export function FundInfo(fund) {
    return (
        <>
          <p>{fund.name}</p>
        </>
    )
}
