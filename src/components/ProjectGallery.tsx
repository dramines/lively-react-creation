import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { projectExamples } from "../config/examplesConfig";

interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  client: string;
  year: string;
}

const ProjectGallery = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section className="pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projectExamples.map((project) => (
            <Card 
              key={project.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <CardContent className="p-0 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={selectedProject?.image}
              alt={selectedProject?.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                {selectedProject?.description}
              </p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Client: {selectedProject?.client}</span>
                <span>Année: {selectedProject?.year}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectGallery;