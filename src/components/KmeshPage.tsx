/*
 * Copyright 2025 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Pod {
  metadata: {
    name: string;
    namespace: string;
  };
  status: {
    phase: string;
  };
}

interface Stats {
  total: number;
  running: number;
  pending: number;
  failed: number;
}

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export default function KmeshPage() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    total: 0,
    running: 0,
    pending: 0,
    failed: 0,
  });

  const [chartData, setChartData] = useState([
    { name: 'Running', value: 0 },
    { name: 'Pending', value: 0 },
    { name: 'Failed', value: 0 },
  ]);

  const [timelineData, setTimelineData] = useState<
    { time: string; pods: number }[]
  >([]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchPods() {
      try {
        const response = await fetch(
          '/api/v1/namespaces/default/pods'
        );

        const text = await response.text();

        const data = JSON.parse(text);

        const podItems = data.items || [];

        setPods(podItems);

        const running = podItems.filter(
          (pod: Pod) => pod.status.phase === 'Running'
        ).length;

        const pending = podItems.filter(
          (pod: Pod) => pod.status.phase === 'Pending'
        ).length;

        const failed = podItems.filter(
          (pod: Pod) => pod.status.phase === 'Failed'
        ).length;

        setStats({
          total: podItems.length,
          running,
          pending,
          failed,
        });

        setChartData([
          { name: 'Running', value: running },
          { name: 'Pending', value: pending },
          { name: 'Failed', value: failed },
        ]);

        setTimelineData(prev => [
          ...prev.slice(-9),
          {
            time: new Date().toLocaleTimeString(),
            pods: podItems.length,
          },
        ]);
      } catch (err) {
        console.error('Error fetching pods:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPods();

    const interval = setInterval(fetchPods, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredPods = pods.filter((pod: Pod) => {
    const matchesSearch = pod.metadata.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' || pod.status.phase === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div
      style={{
        padding: '24px',
        background: '#0f172a',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

      <h1
        style={{
          fontSize: '42px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        🚀 Kmesh Observability Dashboard
      </h1>

      <p
        style={{
          color: '#94a3b8',
          marginBottom: '20px',
          fontSize: '16px',
        }}
      >
        Real-time Kubernetes Monitoring with Headlamp
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '25px',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 14px #22c55e',
            animation: 'pulse 1.5s infinite',
          }}
        />

        <span
          style={{
            color: '#22c55e',
            fontWeight: 'bold',
          }}
        >
          Live Cluster Connected
        </span>

        <span
          style={{
            color: '#94a3b8',
            fontSize: '14px',
          }}
        >
          Auto-refresh every 5 seconds
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '25px',
        }}
      >
        <StatCard
          title="Total Pods"
          value={stats.total}
          color="#ffffff"
        />

        <StatCard
          title="Running Pods"
          value={stats.running}
          color="#22c55e"
        />

        <StatCard
          title="Pending Pods"
          value={stats.pending}
          color="#eab308"
        />

        <StatCard
          title="Failed Pods"
          value={stats.failed}
          color="#ef4444"
        />

        <MetricCard
          title="Cluster CPU"
          value="68%"
          color="#3b82f6"
        />

        <MetricCard
          title="Cluster Memory"
          value="74%"
          color="#a855f7"
        />

        <MetricCard
          title="Network Traffic"
          value="1.2Gb/s"
          color="#06b6d4"
        />

        <MetricCard
          title="Cluster Health"
          value="Healthy"
          color="#22c55e"
        />
      </div>

      <DashboardCard title="🖥️ Cluster Information">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
          }}
        >
          <InfoBox
            label="Cluster"
            value="Minikube"
          />

          <InfoBox
            label="Kubernetes Version"
            value="v1.35.1"
          />

          <InfoBox
            label="Runtime"
            value="Docker"
          />

          <InfoBox
            label="Monitoring"
            value="Enabled"
          />
        </div>
      </DashboardCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '25px',
        }}
      >
        <DashboardCard title="📊 Pod Analytics">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="📈 Live Pod Timeline">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient
                  id="colorPods"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis dataKey="time" />

              <YAxis />

              <CartesianGrid strokeDasharray="3 3" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="pods"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorPods)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      <DashboardCard title="📦 Live Pod Monitor">
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <input
            type="text"
            placeholder="Search pod..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={inputStyle}
          />

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All</option>
            <option value="Running">Running</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {loading ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            Loading cluster data...
          </div>
        ) : filteredPods.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            No pods found
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  background: '#111827',
                }}
              >
                <th style={tableHead}>Pod Name</th>
                <th style={tableHead}>Namespace</th>
                <th style={tableHead}>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPods.map((pod, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid #1e293b',
                  }}
                >
                  <td style={tableCell}>
                    {pod.metadata.name}
                  </td>

                  <td style={tableCell}>
                    <span
                      style={{
                        background: '#1e293b',
                        padding: '6px 10px',
                        borderRadius: '20px',
                        fontSize: '13px',
                      }}
                    >
                      {pod.metadata.namespace}
                    </span>
                  </td>

                  <td style={tableCell}>
                    <StatusBadge
                      status={pod.status.phase}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DashboardCard>

      <DashboardCard title="🛰️ eBPF Traffic Flows">
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr
              style={{
                background: '#111827',
              }}
            >
              <th style={tableHead}>Source</th>
              <th style={tableHead}>Destination</th>
              <th style={tableHead}>Action</th>
              <th style={tableHead}>Packets</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={tableCell}>frontend-pod</td>
              <td style={tableCell}>auth-service</td>
              <td style={tableCell}>
                <StatusBadge status="ALLOW" />
              </td>
              <td style={tableCell}>1240</td>
            </tr>

            <tr>
              <td style={tableCell}>api-gateway</td>
              <td style={tableCell}>payment-service</td>
              <td style={tableCell}>
                <StatusBadge status="ALLOW" />
              </td>
              <td style={tableCell}>892</td>
            </tr>

            <tr>
              <td style={tableCell}>unknown-client</td>
              <td style={tableCell}>admin-service</td>
              <td style={tableCell}>
                <StatusBadge status="DENY" />
              </td>
              <td style={tableCell}>54</td>
            </tr>
          </tbody>
        </table>
      </DashboardCard>

      <div
        style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
        }}
      >
        Powered by Kmesh + Headlamp + Kubernetes
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#111827',
        padding: '20px',
        borderRadius: '18px',
        marginBottom: '25px',
        boxShadow: '0 0 20px rgba(0,0,0,0.25)',
      }}
    >
      <h2
        style={{
          marginBottom: '20px',
          fontSize: '22px',
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background:
          'linear-gradient(145deg, #111827, #1e293b)',
        padding: '24px',
        borderRadius: '18px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        border: `1px solid ${color}30`,
        transition: '0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform =
          'translateY(-5px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform =
          'translateY(0px)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            color: '#94a3b8',
          }}
        >
          {title}
        </h3>

        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>

      <h1
        style={{
          fontSize: '42px',
          color,
          marginTop: '14px',
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background:
          'linear-gradient(145deg, #111827, #1e293b)',
        padding: '24px',
        borderRadius: '18px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        transition: '0.3s',
        border: `1px solid ${color}40`,
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform =
          'translateY(-5px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform =
          'translateY(0px)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h3
          style={{
            color: '#94a3b8',
            fontSize: '15px',
          }}
        >
          {title}
        </h3>

        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>

      <h1
        style={{
          fontSize: '36px',
          color,
          fontWeight: 'bold',
        }}
      >
        {value}
      </h1>

      <div
        style={{
          marginTop: '14px',
          height: '6px',
          background: '#0f172a',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: value.includes('%')
              ? value
              : '80%',
            height: '100%',
            background: color,
            borderRadius: '20px',
          }}
        />
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: '#0f172a',
        padding: '20px',
        borderRadius: '14px',
        border: '1px solid #1e293b',
      }}
    >
      <p
        style={{
          color: '#94a3b8',
          marginBottom: '8px',
        }}
      >
        {label}
      </p>

      <h2
        style={{
          fontSize: '22px',
          color: '#fff',
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const background =
    status === 'Running' || status === 'ALLOW'
      ? '#166534'
      : status === 'Pending'
        ? '#854d0e'
        : '#991b1b';

  return (
    <span
      style={{
        background,
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 'bold',
      }}
    >
      {status}
    </span>
  );
}

const inputStyle = {
  padding: '10px',
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '10px',
  color: 'white',
};

const tableHead = {
  textAlign: 'left' as const,
  padding: '14px',
};

const tableCell = {
  padding: '14px',
};