# Kmesh Observability Dashboard

## Overview

Kmesh Observability Dashboard is a real-time Kubernetes observability plugin built using the Headlamp plugin system. The project provides live monitoring and visualization of Kubernetes cluster activity through an interactive dashboard interface.

The dashboard focuses on:

* Real-time pod monitoring
* Cluster event tracking
* Pod analytics visualization
* Live timeline updates
* eBPF traffic flow simulation
* Kubernetes observability UI

---

## Features

### Live Pod Monitoring

Displays live Kubernetes pod information including:

* Pod name
* Namespace
* Pod status
* Running state

The dashboard refreshes automatically every 5 seconds.

### Pod Analytics Dashboard

Visualizes:

* Running pods
* Pending pods
* Failed pods

Using interactive charts built with Recharts.

### Live Pod Timeline

Tracks pod count changes in real time using dynamic timeline graphs.

### Cluster Events Monitoring

Displays Kubernetes cluster events including:

* Failed scheduling
* Warning events
* Restart events
* Normal cluster activity

### eBPF Traffic Flow Visualization

Provides simulated service-to-service traffic monitoring.

### Connection Status Monitoring

Shows real-time Kubernetes API connection status.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Recharts
* Headlamp Plugin API

### Platform

* Kubernetes
* Minikube
* Headlamp

---

## Project Structure

```text
frontend/
└── src/
    └── plugin/
        └── kmesh-observability/
            ├── index.tsx
            └── KmeshPage.tsx
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/shubhtrek/kmesh-observability-dashboard.git
```

### Install Dependencies

```bash
cd headlamp/frontend
npm install
```

### Start Minikube

```bash
minikube start --driver=docker
```

### Verify Cluster

```bash
kubectl get pods -A
```

### Start Headlamp Frontend

```bash
npm start
```

### Start Headlamp Backend

```bash
cd ../backend/cmd
./headlamp-server.exe -dev --listen-addr=0.0.0.0:4466
```

---

## Usage

Open:

```text
http://localhost:3000/kmesh
```

The dashboard automatically:

* Fetches pod data
* Fetches cluster events
* Refreshes metrics every 5 seconds
* Updates charts in real time

---

## Screenshots

<img width="1907" height="1091" alt="image" src="https://github.com/user-attachments/assets/e6376dd6-d654-496f-8fd5-ad202683b133" />

<img width="1917" height="1146" alt="image" src="https://github.com/user-attachments/assets/ca2ad39d-68df-4ff5-957c-1cea9c9a17fe" />

---

## Live Demo

```text
https://your-live-demo-link.com
```

---

## Future Improvements

Potential future improvements:

* Real eBPF integration
* Prometheus metrics integration
* Namespace filtering
* CPU and memory monitoring
* Multi-cluster support
* WebSocket streaming
* Node analytics

---

## Author

Shubh Pingale
