import { Link } from "@inertiajs/react";

export default function ProjectList({ projects }) {
    return (
        <div className="w-full overflow-x-auto mt-4">
            <table className="border-collapse border border-gray-300 mx-auto w-3/4 text-center mb-20">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2 w-1/5">Nom du projet / association</th>
                        <th className="border border-gray-400 p-2 w-1/5">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, index) => (
                        <tr key={index}>
                            <td className="border border-gray-400 p-2">
                                <Link href={route('project.show', project)}>
                                    <div className="flex justify-center items-center gap-2">
                                        {project.image ? (
                                            <img src={project.image} alt={project.name} className="w-16 h-16 object-cover rounded-full" />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">{project.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                        )}
                                        {project.name}
                                    </div>
                                </Link>
                            </td>
                            <td className={`border border-gray-400 p-2 ${project.description ? 'bg-green-300/20' : 'bg-red-300/20'}`}>
                                <span className="inline-block px-2 py-1 font-medium">
                                    {project.description}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}