<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'name' => 'Construction d\'un puits',
                'description' => 'Ce projet vise à construire un puits dans un village rural pour fournir un accès à l\'eau potable à plus de 500 personnes. L\'eau est essentielle pour la vie quotidienne, l\'agriculture et l\'élevage dans cette région.',
                'image' => null,
            ],
            [
                'name' => 'Centre de formation professionnelle',
                'description' => 'Création d\'un centre de formation professionnelle pour les jeunes défavorisés. Ce centre offrira des formations en menuiserie, couture, informatique et agriculture durable pour favoriser l\'insertion professionnelle.',
                'image' => null,
            ],
            [
                'name' => 'Programme de reforestation',
                'description' => 'Initiative de reforestation visant à planter 10 000 arbres dans les zones touchées par la déforestation. Ce projet contribuera à la restauration des écosystèmes locaux et à la lutte contre l\'érosion des sols.',
                'image' => null,
            ],
            [
                'name' => 'Équipement médical pour dispensaire',
                'description' => 'Acquisition d\'équipements médicaux essentiels pour un dispensaire rural desservant une population de 2 000 personnes. Ce projet permettra d\'améliorer les soins de santé primaires et les services de maternité.',
                'image' => null,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
