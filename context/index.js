import React from "react";


const ProjectContext = React.createContext();

export const ProjectProvider = ProjectContext.Provider;
export const ProjectConsumer = ProjectContext.Consumer;

export default ProjectContext;