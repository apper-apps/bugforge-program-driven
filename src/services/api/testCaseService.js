import testCasesData from "@/services/mockData/testCases.json";

let testCases = [...testCasesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const testCaseService = {
  async getAll() {
    await delay(400);
    return [...testCases];
  },

  async getById(id) {
    await delay(250);
    const testCase = testCases.find(tc => tc.Id === parseInt(id));
    if (!testCase) {
      throw new Error("Test case not found");
    }
    return { ...testCase };
  },

  async getByProject(projectId) {
    await delay(350);
    return testCases.filter(tc => tc.projectId === projectId.toString());
  },

  async create(testCaseData) {
    await delay(500);
    const newTestCase = {
      Id: Math.max(...testCases.map(tc => tc.Id)) + 1,
      ...testCaseData,
      status: "draft",
      lastRun: null,
      lastResult: null
    };
    testCases.push(newTestCase);
    return { ...newTestCase };
  },

  async update(id, testCaseData) {
    await delay(400);
    const index = testCases.findIndex(tc => tc.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Test case not found");
    }
    testCases[index] = { ...testCases[index], ...testCaseData };
    return { ...testCases[index] };
  },

  async updateResult(id, result) {
    await delay(300);
    const index = testCases.findIndex(tc => tc.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Test case not found");
    }
    testCases[index] = {
      ...testCases[index],
      lastRun: new Date().toISOString(),
      lastResult: result
    };
    return { ...testCases[index] };
  },

  async delete(id) {
    await delay(300);
    const index = testCases.findIndex(tc => tc.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Test case not found");
    }
    testCases.splice(index, 1);
    return { success: true };
  }
};