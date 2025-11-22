"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { Mail, Download, Send, RefreshCw, X } from "lucide-react";
import { EmailMarketing } from "../../../lib/types";
import { createClient } from "@/lib/supabase/client";

const EmailMarketingAdmin = ({
  emailMarketing,
}: {
  emailMarketing: EmailMarketing[];
}) => {
  const [loading, setLoading] = useState(false);
  const [emailMarketingData, setEmailMarketingData] = useState(emailMarketing);

  const [campaignDialog, setCampaignDialog] = useState(false);
  const [emailCampaign, setEmailCampaign] = useState({
    subject: "",
    content: "",
    includeUsers: true,
  });

  const [exportDialog, setExportDialog] = useState(false);
  const reloadData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emailmarketing`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch email marketing data");
      }
      const result = await response.json();
      console.log("Fetched email marketing result:", result.data);
      setEmailMarketingData(result.data);
    } catch (error) {
      console.error("Error fetching email marketing data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = () => {
    setLoading(true);
    reloadData();
  };
  const [accessToken, setAccessToken] = useState("");

  //   const handleSendCampaign = () => {
  //     const filteredSubscribers = subscribers.filter((subscriber) => {
  //       if (emailCampaign.includeUsers && exportFilters.userType === "system") {
  //         return subscriber.source === "user";
  //       }
  //       if (exportFilters.userType === "subscriber") {
  //         return subscriber.source === "newsletter";
  //       }
  //       return true; // Default to include all
  //     });

  //     console.log("Sending campaign to:", filteredSubscribers);
  //     // Add logic to send email campaign to filteredSubscribers
  //   };
  const supabase = createClient();
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || "");
      if (!session) {
        window.location.href = "/auth/login";
      }
    };

    fetchSession();
  }, []);
  const [typeExport, setTypeExport] = useState("system");
  const handleExport = async () => {
    try {
      const exportUrl =
        typeExport === "system"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emailmarketing/export-users`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emailmarketing/export-newsletter-subscribed`;

      const res = await fetch(exportUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        console.log("Export response received", res);
        const contentType = res.headers.get("Content-Type");
        if (!contentType || !contentType.startsWith("text/csv")) {
          console.error("Invalid Content-Type:", contentType);
          alert("Failed to export data: Invalid response format.");
          return;
        }

        const text = await res.text();
        if (!text.trim()) {
          console.error("Export failed: Empty data.");
          alert("No data available to export.");
          return;
        }

        // Thêm BOM để Excel nhận diện UTF-8
        const bom = "\uFEFF";
        const blob = new Blob([bom + text], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `user_list_${
          typeExport === "system" ? "system_users" : "subscribers"
        }_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setExportDialog(false);
      } else {
        console.error("Export failed: Invalid status code", res.status);
        alert("Failed to export data. Please try again.");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("An error occurred while exporting data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Mail className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Email Marketing Dashboard
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setCampaignDialog(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Send className="w-4 h-4" />
            Create Email Campaign
          </button>
          <button
            onClick={() => setExportDialog(true)}
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Export User Data
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Email Subscribers
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailMarketingData.map((subscriber: EmailMarketing) => (
                  <tr
                    key={`${subscriber.Username}${subscriber.email}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscriber.Username ? subscriber.Username : "subscriber"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscriber.type === "user"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {subscriber.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Campaign Dialog */}
        {/* {campaignDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Create Email Campaign
                </h3>
                <button
                  onClick={() => setCampaignDialog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailCampaign.subject}
                    onChange={(e) =>
                      setEmailCampaign((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="🎉 Special Offer Just for You!"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content (HTML)
                  </label>
                  <textarea
                    value={emailCampaign.content}
                    onChange={(e) =>
                      setEmailCampaign((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Enter your email content here..."
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeUsers"
                    checked={emailCampaign.includeUsers}
                    onChange={(e) =>
                      setEmailCampaign((prev) => ({
                        ...prev,
                        includeUsers: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="includeUsers"
                    className="text-sm text-gray-700"
                  >
                    Include registered users who opted in for marketing
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setCampaignDialog(false)}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendCampaign}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Campaign
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Export Dialog */}
        {exportDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Export User Information
                </h3>
                <button
                  onClick={() => setExportDialog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Export user data with detailed information including id, email
                  and subscriber date
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Type
                    </label>
                    <select
                      value={typeExport}
                      onChange={(e) => setTypeExport(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="system">System Users</option>
                      <option value="subscriber">Subscribers</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setExportDialog(false)}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailMarketingAdmin;
