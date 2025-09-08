import bugsData from "@/services/mockData/bugs.json";

let bugs = [...bugsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bugService = {
  async getAll() {
    await delay(350);
    return [...bugs];
  },

  async getById(id) {
    await delay(200);
    const bug = bugs.find(b => b.Id === parseInt(id));
    if (!bug) {
      throw new Error("Bug not found");
    }
    return { ...bug };
  },

  async getByProject(projectId) {
    await delay(300);
    return bugs.filter(b => b.projectId === projectId.toString());
  },

  async create(bugData) {
    await delay(450);
    const newBug = {
      Id: Math.max(...bugs.map(b => b.Id)) + 1,
      ...bugData,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    bugs.push(newBug);
    return { ...newBug };
  },

  async update(id, bugData) {
    await delay(400);
    const index = bugs.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bug not found");
    }
    bugs[index] = {
      ...bugs[index],
      ...bugData,
      updatedAt: new Date().toISOString()
    };
    return { ...bugs[index] };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = bugs.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bug not found");
    }
    bugs[index] = {
      ...bugs[index],
      status,
      updatedAt: new Date().toISOString()
    };
    return { ...bugs[index] };
  },

  async delete(id) {
    await delay(300);
    const index = bugs.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bug not found");
    }
    bugs.splice(index, 1);
    return { success: true };
  }
};