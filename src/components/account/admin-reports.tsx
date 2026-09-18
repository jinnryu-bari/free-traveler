"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useAccountRole } from "./role-gate";

type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

interface Report {
  id: string;
  target_post_id: string | null;
  target_user_id: string | null;
  reason_code: string;
  description: string;
  status: ReportStatus;
  created_at: string;
}

const STATUS_OPTIONS: ReportStatus[] = ["OPEN", "RESOLVED", "DISMISSED"];
const STATUS_LABEL: Record<ReportStatus, string> = { OPEN: "처리 대기", RESOLVED: "처리 완료", DISMISSED: "반려" };

/**
 * SCR-005 Admin — 신고 상태 필터·변경(간소화, REQ-FUNC-041). `/api/admin/reports`(API-ADMIN-REPORTS)를
 * 호출한다. 이 Component 자신도 role을 다시 확인해 moderator/admin이 아니면 아무것도 렌더링하지
 * 않는다 — Page Owner의 조건부 마운트와 별개로 자체 방어선을 하나 더 둔다(Security AC).
 */
export function AdminReports() {
  const { role, loading: roleLoading } = useAccountRole();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<ReportStatus>("OPEN");
  const [result, setResult] = useState<{ key: string; reports: Report[] | null; error: boolean }>({
    key: "",
    reports: null,
    error: false,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAdmin = role === "moderator" || role === "admin";

  const load = useCallback(async (status: ReportStatus) => {
    try {
      const res = await fetch(`/api/admin/reports?status=${status}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const body = (await res.json()) as { reports: Report[] };
      setResult({ key: status, reports: body.reports, error: false });
    } catch {
      setResult({ key: status, reports: null, error: true });
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    fetch(`/api/admin/reports?status=${filter}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ reports: Report[] }>;
      })
      .then((body) => {
        if (active) setResult({ key: filter, reports: body.reports, error: false });
      })
      .catch(() => {
        if (active) setResult({ key: filter, reports: null, error: true });
      });
    return () => {
      active = false;
    };
  }, [isAdmin, filter]);

  const isLoading = result.key !== filter;
  const reports = isLoading ? null : result.reports;
  const loadError = !isLoading && result.error;

  const changeStatus = async (reportId: string, status: ReportStatus) => {
    if (updatingId) return;
    setUpdatingId(reportId);
    const res = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status }),
    });
    setUpdatingId(null);
    if (!res.ok) {
      showToast("error", "신고 상태를 변경하지 못했다");
      return;
    }
    showToast("success", "신고 상태를 변경했다");
    load(filter);
  };

  if (roleLoading) {
    return <div className="h-40 animate-pulse rounded-md bg-surface-strong" />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-title-md text-ink">신고 관리</p>
        <p className="text-body-sm text-body">신고 상태를 확인하고 처리 결과를 기록합니다.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="admin-report-filter" className="text-body-sm text-ink">
          상태 필터
        </label>
        <select
          id="admin-report-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as ReportStatus)}
          className="border-hairline text-body-sm w-fit rounded-sm border px-3 py-2 text-ink"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {STATUS_LABEL[option]}
            </option>
          ))}
        </select>
      </div>

      {loadError && <p className="text-body-sm text-danger">신고 목록을 불러오지 못했다.</p>}
      {!loadError && reports === null && <div className="h-24 animate-pulse rounded-md bg-surface-strong" />}
      {!loadError && reports !== null && reports.length === 0 && (
        <div className="border-hairline rounded-md border p-6 text-center">
          <p className="text-body-md text-ink">현재 처리할 신고가 없어요.</p>
        </div>
      )}
      {!loadError && reports !== null && reports.length > 0 && (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <div key={report.id} className="shadow-card flex flex-col gap-2 rounded-md p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-body-sm text-ink">사유: {report.reason_code}</p>
                <span className="text-caption bg-surface-strong text-body rounded-full px-2 py-0.5">
                  {STATUS_LABEL[report.status]}
                </span>
              </div>
              <p className="text-body-sm text-body">{report.description}</p>
              <p className="text-caption text-body">
                대상: {report.target_post_id ? `동행글 ${report.target_post_id}` : `사용자 ${report.target_user_id}`}
              </p>
              {report.status !== "RESOLVED" && report.status !== "DISMISSED" ? (
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => changeStatus(report.id, "RESOLVED")}
                    disabled={updatingId === report.id}
                    className="text-button inline-flex h-8 items-center rounded-sm bg-brand-coral px-3 text-on-brand disabled:opacity-50"
                  >
                    처리 완료로 변경
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus(report.id, "DISMISSED")}
                    disabled={updatingId === report.id}
                    className="text-button border-hairline inline-flex h-8 items-center rounded-sm border px-3 text-ink disabled:opacity-50"
                  >
                    반려
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => changeStatus(report.id, "OPEN")}
                  disabled={updatingId === report.id}
                  className="text-button border-hairline mt-1 inline-flex h-8 w-fit items-center rounded-sm border px-3 text-ink disabled:opacity-50"
                >
                  처리 대기로 되돌리기
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
