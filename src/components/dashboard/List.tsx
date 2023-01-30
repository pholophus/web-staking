import React, { useEffect, useState } from "react";
import MetaBtn from "../metamask/metamask-btn";
import {readSC} from "../../services";

const List = () => {
    const [listSC, setListSC] = useState([]);

    useEffect(() => {
        readSC().then((res) => {
            console.log("res", res);
        });
    })

    return (
        <>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="p-1.5 w-full inline-block align-middle">
                        <div className="overflow-hidden border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 bg-[#212121]">
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 text-sm font-medium text-[#ffffff] whitespace-nowrap">
                                            OASIS
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#ffffff] whitespace-nowrap">
                                            <div className="flex">
                                                <p className="">End</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                                </svg>
                                            </div>
                                            <div className="flex">
                                            47 D 5 H 14 M
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#ffffff] whitespace-nowrap">
                                            <div className="flex">
                                                <p className="">APR</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                                </svg>
                                            </div>
                                            <div className="flex">
                                                46.99%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#ffffff] whitespace-nowrap">
                                            <div className="flex">
                                                <p className="">Total Staked</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                                </svg>
                                            </div>
                                            <div className="flex">
                                                $3,679,899
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#ffffff] whitespace-nowrap">
                                            <div className="flex">
                                                <p className="">80%</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default List;