import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import DashboardStats from "@/components/organisms/DashboardStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import { bugService } from "@/services/api/bugService";
import { testCaseService } from "@/services/api/testCaseService";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [bugs, testCases] = await Promise.all([
        bugService.getAll(),
        testCaseService.getAll()
      ]);

const openBugs = bugs.filter(b => !["resolved", "closed"].includes(b.status_c)).length;
      const passedTests = testCases.filter(tc => tc.last_result_c === "pass").length;
      const totalRunTests = testCases.filter(tc => tc.last_result_c).length;
      const passRate = totalRunTests > 0 ? Math.round((passedTests / totalRunTests) * 100) : 0;

const severityData = {
        critical: bugs.filter(b => b.severity_c === "critical").length,
        high: bugs.filter(b => b.severity_c === "high").length,
        medium: bugs.filter(b => b.severity_c === "medium").length,
        low: bugs.filter(b => b.severity_c === "low").length
      };

      const statusData = {
        new: bugs.filter(b => b.status_c === "new").length,
        assigned: bugs.filter(b => b.status_c === "assigned").length,
        "in-progress": bugs.filter(b => b.status_c === "in-progress").length,
        testing: bugs.filter(b => b.status_c === "testing").length,
        resolved: bugs.filter(b => b.status_c === "resolved").length,
        closed: bugs.filter(b => b.status_c === "closed").length
      };

      const testResultData = {
        pass: testCases.filter(tc => tc.last_result_c === "pass").length,
        fail: testCases.filter(tc => tc.last_result_c === "fail").length,
        blocked: testCases.filter(tc => tc.last_result_c === "blocked").length,
        skip: testCases.filter(tc => tc.last_result_c === "skip").length,
        "not-run": testCases.filter(tc => !tc.last_result_c).length
      };

      setData({
        stats: {
          totalBugs: bugs.length,
          openBugs,
          totalTestCases: testCases.length,
          passRate
        },
        severityData,
        statusData,
        testResultData
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const severityChartOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false }
    },
    colors: ["#EF4444", "#F59E0B", "#3B82F6", "#6B7280"],
    labels: ["Critical", "High", "Medium", "Low"],
    legend: {
      position: "bottom",
      fontSize: "14px"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%"
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.config.series[opt.seriesIndex];
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + " bugs";
        }
      }
    }
  };

  const statusChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      height: 300
    },
    colors: ["#3B82F6"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ["New", "Assigned", "In Progress", "Testing", "Resolved", "Closed"]
    },
    grid: {
      borderColor: "#F3F4F6"
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + " bugs";
        }
      }
    }
  };

  const testResultChartOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false }
    },
    colors: ["#10B981", "#EF4444", "#F59E0B", "#6B7280", "#E5E7EB"],
    labels: ["Pass", "Fail", "Blocked", "Skip", "Not Run"],
    legend: {
      position: "bottom",
      fontSize: "14px"
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.config.series[opt.seriesIndex];
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + " tests";
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardStats stats={data.stats} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Bug Severity Distribution
            </h3>
            <ReactApexChart
              options={severityChartOptions}
              series={Object.values(data.severityData)}
              type="donut"
              height={300}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Test Results Overview
            </h3>
            <ReactApexChart
              options={testResultChartOptions}
              series={Object.values(data.testResultData)}
              type="pie"
              height={300}
            />
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Bug Status Distribution
          </h3>
          <ReactApexChart
            options={statusChartOptions}
            series={[{
              name: "Bugs",
              data: Object.values(data.statusData)
            }]}
            type="bar"
            height={300}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;