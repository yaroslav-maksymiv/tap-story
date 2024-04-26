import React from "react";
import {Link} from "react-router-dom";
import {StoriesList} from "../features/story/StoriesList";

export const Home: React.FC = () => {
    return (
        <div className="pt-12">
            <div className="">

                <div className="bg-dark">
                    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-white">
                        <h2 className="text-2xl font-bold tracking-tight">Horrors</h2>

                        <div className="mt-6">
                            <StoriesList />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}