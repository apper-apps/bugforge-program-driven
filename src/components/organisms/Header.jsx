import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import { notificationService } from "@/services/api/notificationService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import NotificationBell from "@/components/molecules/NotificationBell";
const Header = ({ title, onMenuClick, searchValue, onSearchChange, onSearchClear, actions }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

<div className="flex items-center gap-4">
{(searchValue !== undefined || onSearchChange) && (
<div className="hidden sm:block">
<SearchBar
value={searchValue || ""}
onChange={onSearchChange}
onClear={onSearchClear}
placeholder="Search..."
className="w-80"
/>
</div>
)}

{actions && (
<div className="flex items-center gap-2">
{actions}
</div>
)}

<NotificationBell />

<div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.firstName} {user.lastName}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {(searchValue !== undefined || onSearchChange) && (
        <div className="sm:hidden mt-4">
          <SearchBar
            value={searchValue || ""}
            onChange={onSearchChange}
            onClear={onSearchClear}
            placeholder="Search..."
          />
        </div>
      )}
    </header>
  );
};

export default Header;