import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Bugs",
      value: stats.totalBugs,
      icon: "Bug",
      color: "from-error to-red-600",
      bgColor: "from-error/10 to-red-600/10"
    },
    {
      title: "Open Bugs",
      value: stats.openBugs,
      icon: "AlertCircle",
      color: "from-warning to-amber-600",
      bgColor: "from-warning/10 to-amber-600/10"
    },
    {
      title: "Test Cases",
      value: stats.totalTestCases,
      icon: "FileText",
      color: "from-primary to-blue-600",
      bgColor: "from-primary/10 to-blue-600/10"
    },
    {
      title: "Pass Rate",
      value: `${stats.passRate}%`,
      icon: "CheckCircle",
      color: "from-success to-green-600",
      bgColor: "from-success/10 to-green-600/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.bgColor} flex items-center justify-center`}>
                <ApperIcon 
                  name={stat.icon} 
                  className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;