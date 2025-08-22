import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import { usePage } from "@inertiajs/react";
import ProjectList from "@/Components/ProjectList.jsx";

export default function ProjectIndex() {
    const { projects } = usePage().props;
    return (
        <MainStructure pageTitle="Projets">
            <div className='flex flex-col w-full'>
                <div className="p-3 ">
                    <TitleAndSpan title="Projets" />
                    <ProjectList projects={projects} />
                </div>
            </div>
        </MainStructure>
    );
}