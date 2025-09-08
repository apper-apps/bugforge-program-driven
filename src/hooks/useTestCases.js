import { useState, useEffect } from "react";
import { testCaseService } from "@/services/api/testCaseService";

const useTestCases = () => {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTestCases = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await testCaseService.getAll();
      setTestCases(data);
    } catch (err) {
      setError(err.message || "Failed to load test cases");
    } finally {
      setLoading(false);
    }
  };

  const createTestCase = async (testCaseData) => {
    const newTestCase = await testCaseService.create(testCaseData);
    setTestCases(prev => [...prev, newTestCase]);
    return newTestCase;
  };

  const updateTestCase = async (id, testCaseData) => {
    const updatedTestCase = await testCaseService.update(id, testCaseData);
    setTestCases(prev => prev.map(tc => 
      tc.Id === parseInt(id) ? updatedTestCase : tc
    ));
    return updatedTestCase;
  };

  const deleteTestCase = async (id) => {
    await testCaseService.delete(id);
    setTestCases(prev => prev.filter(tc => tc.Id !== parseInt(id)));
  };

  const runTestCase = async (id, result) => {
    const updatedTestCase = await testCaseService.updateResult(id, result);
    setTestCases(prev => prev.map(tc => 
      tc.Id === parseInt(id) ? updatedTestCase : tc
    ));
    return updatedTestCase;
  };

  useEffect(() => {
    loadTestCases();
  }, []);

  return {
    testCases,
    loading,
    error,
    createTestCase,
    updateTestCase,
    deleteTestCase,
    runTestCase,
    refetch: loadTestCases
  };
};

export default useTestCases;