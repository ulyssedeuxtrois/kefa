"use client";

import { useEffect, useState } from "react";
import { Users, Store, Mail, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface OrganizerLead {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  events: { id: string; title: string; status: string; date: string }[];
  _count: { events: number };
}

interface PublicLead {
  id: string;
  title: string;
  submitterName: string | null;
  submitterEmail: string | null;
  status: string;
  createdAt: string;
}

interface Stats {
  totalOrganizers: number;
  totalPublicLeads: number;
  totalLeads: number;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
        <CheckCircle className="w-3 h-3" /> Approuvé
      </span>
    );
  if (status === "REJECTED")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
        <XCircle className="w-3 h-3" /> Refusé
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" /> En attente
    </span>
  );
}

export default function LeadsPage() {
  const [organizers, setOrganizers] = useState<OrganizerLead[]>([]);
  const [publicLeads, setPublicLeads] = useState<PublicLead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const secret = prompt("Secret admin :");
    if (!secret) { setError("Accès refusé"); setLoading(false); return; }

    fetch("/api/admin/leads", { headers: { "x-admin-secret": secret } })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setOrganizers(d.organizers);
        setPublicLeads(d.publicLeads);
        setStats(d.stats);
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Admin</Link>
        <h1 className="text-2xl font-bold text-gray-900">Pipeline organisateurs</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-5 text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.totalLeads}</div>
            <div className="text-sm text-gray-500 mt-1">Leads total</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalOrganizers}</div>
            <div className="text-sm text-gray-500 mt-1">Comptes organisateur</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.totalPublicLeads}</div>
            <div className="text-sm text-gray-500 mt-1">Soumissions sans compte</div>
          </div>
        </div>
      )}

      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Store className="w-5 h-5 text-primary-600" />
          Organisateurs inscrits ({organizers.length})
        </h2>
        <div className="space-y-3">
          {organizers.length === 0 && (
            <p className="text-gray-400 text-sm">Aucun organisateur pour l&apos;instant.</p>
          )}
          {organizers.map((org) => (
            <div key={org.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{org.name || "—"}</p>
                  <a href={`mailto:${org.email}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {org.email}
                  </a>
                  <p className="text-xs text-gray-400 mt-1">
                    Inscrit le {formatDate(org.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700">{org._count.events} event{org._count.events > 1 ? "s" : ""}</span>
                </div>
              </div>
              {org.events.length > 0 && (
                <div className="mt-3 space-y-1 border-t pt-3">
                  {org.events.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between text-sm">
                      <Link href={`/events/${ev.id}`} className="text-gray-700 hover:text-primary-600 truncate max-w-xs">
                        {ev.title}
                      </Link>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(ev.date)}
                        </span>
                        <StatusBadge status={ev.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Users className="w-5 h-5 text-yellow-600" />
          Soumissions sans compte ({publicLeads.length})
        </h2>
        <div className="space-y-2">
          {publicLeads.length === 0 && (
            <p className="text-gray-400 text-sm">Aucune soumission publique pour l&apos;instant.</p>
          )}
          {publicLeads.map((lead) => (
            <div key={lead.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">{lead.submitterName || "Anonyme"}</p>
                {lead.submitterEmail && (
                  <a href={`mailto:${lead.submitterEmail}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {lead.submitterEmail}
                  </a>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Event : {lead.title}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={lead.status} />
                <span className="text-xs text-gray-400">{formatDate(lead.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
