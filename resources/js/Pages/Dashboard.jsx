import { Head, router, usePage } from '@inertiajs/react';
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import React from "react";
import EventDisplay from '@/Components/EventDisplay';
import DetenteDisplay from '@/Components/DetenteDisplay';

// Import des widgets
import WidgetContainer from '@/Components/Dashboard/WidgetContainer';
import FundsWidget from '@/Components/Dashboard/FundsWidget';
import DetenteWidget from '@/Components/Dashboard/DetenteWidget';
import EventsWidget from '@/Components/Dashboard/EventsWidget';
import TransactionsWidget from '@/Components/Dashboard/TransactionsWidget';
import ProjectsWidget from '@/Components/Dashboard/ProjectsWidget';


export default function Dashboard() {
    const {
        user,
        events,
        detenteParticipants,
        funds,
        totalFundsAmount,
        fundCount,
        recentTransactions,
        projects
    } = usePage().props;

    return (
        <MainStructure pageTitle={'Dashboard'}>
            <section className={"flex-grow lg:p-3"}>
                <TitleAndSpan onClick={() => router.visit(route('dashboard'))} title={'DashBoard'} />
                <p className='small-title-style max-lg:my-2 lg:m-4'>Bienvenue {user.name}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    <WidgetContainer requiredPermission="access-funds">
                        <FundsWidget
                            funds={funds}
                            totalAmount={totalFundsAmount}
                            fundCount={fundCount}
                        />
                    </WidgetContainer>

                    <WidgetContainer requiredPermission="access-meetings">
                        <EventsWidget events={events} />
                    </WidgetContainer>

                    <WidgetContainer requiredPermission="access-detente">
                        <DetenteWidget
                            participants={detenteParticipants}
                            participantCount={detenteParticipants.length}
                        />
                    </WidgetContainer>

                    <WidgetContainer requiredPermission="access-funds">
                        <TransactionsWidget transactions={recentTransactions} />
                    </WidgetContainer>

                    <WidgetContainer requiredPermission="access-projects">
                        <ProjectsWidget projects={projects || []} />
                    </WidgetContainer>
                </div>
            </section>
        </MainStructure>
    );
}
