import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { bugService } from '@/services/api/bugService';
const useBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBugs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bugService.getAll();
      setBugs(data);
    } catch (err) {
      setError(err.message || "Failed to load bugs");
    } finally {
      setLoading(false);
    }
  };

const createBug = async (bugData) => {
    const newBug = await bugService.create(bugData);
    setBugs(prev => [...prev, newBug]);
    toast.success('Bug reported successfully');
    return newBug;
  };

  const updateBug = async (id, bugData) => {
    const updatedBug = await bugService.update(id, bugData);
setBugs(prev => prev.map(b => 
       b.Id === parseInt(id) ? updatedBug : b
     ));
     toast.success('Bug updated successfully');
     return updatedBug;
  };

  const updateBugStatus = async (id, status) => {
const updatedBug = await bugService.updateStatus(id, status);
     setBugs(prev => prev.map(b => 
       b.Id === parseInt(id) ? updatedBug : b
     ));
     toast.success(`Bug status updated to ${status.replace("-", " ")}`);
    return updatedBug;
  };

  const deleteBug = async (id) => {
    await bugService.delete(id);
    setBugs(prev => prev.filter(b => b.Id !== parseInt(id)));
  };

  useEffect(() => {
    loadBugs();
  }, []);

  return {
    bugs,
    loading,
    error,
    createBug,
    updateBug,
    updateBugStatus,
    deleteBug,
    refetch: loadBugs
  };
};

export default useBugs;