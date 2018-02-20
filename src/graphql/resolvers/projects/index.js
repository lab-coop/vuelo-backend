const { ObjectId } = require('mongodb');
const { first } = require('lodash');

module.exports = {
  // Queries
  async allProjects(root, data, { user, mongo: { Projects } }) {
    const projects = await Projects.find({ userId: user.id }).toArray();

    console.log({ projects, userId: user.id, user });

    return projects;
  },

  // Mutations
  async createProject(root, { title, color }, { user, mongo: { Projects } }) {
    const project = {
      title,
      color,
      userId: user._id
    };

    const { insertedIds } = await Projects.insert(project);
    const newProject = Object.assign({}, { id: first(insertedIds) }, project);

    return newProject;
  },
  async updateProject(
    root,
    { id, ...updateWith },
    { user, mongo: { Projects } }
  ) {
    const project = await Projects.findOne({
      _id: ObjectId(id),
      userId: user.id
    });

    if (!project) {
      throw new Error('Project not found!');
    }

    await Projects.updateOne(project, { $set: updateWith });

    return { ...project, ...updateWith };
  },

  // Type
  Project: {
    id: ({ _id, id }) => _id || id
  }
};
