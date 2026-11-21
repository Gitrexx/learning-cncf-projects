# CNCF Graduated Projects — Learning Landscape

## About this journey
- **Learner context:** Comfortable and fluent with Kubernetes, but keeps encountering the names
  of CNCF *graduated* projects in blogs and talks without knowing what they actually are or do.
  Goal: turn each graduated project from "a name I've seen" into real, working understanding —
  what problem it solves, where it fits in the cloud-native stack, how it works under the hood,
  and when you'd reach for it. Studied at a pace of roughly one project per day.
- **Mode:** landscape (41 largely independent projects, explorable in any order, grouped into
  8 sections). A few genuine build-on relationships are captured as prerequisites (e.g. Istio
  builds on Envoy; SPIRE builds on SPIFFE).
- **How this works:** ROADMAP.md is the plan. Deep-dives are standalone interactive HTML pages
  in `/content`, indexed by `content/manifest.json`, shown by the app at `/index.html`
  (deployed to GitHub Pages).
- **Scope note:** This list is pinned to the **41 CNCF graduated projects** as verified from the
  canonical `cncf/landscape` source (`landscape.yml`, November 2026). The original 36 (verified
  July 2026, including Knative — Oct 2025, Dragonfly — Jan 2026, OpenTelemetry — May 2026) are all
  still graduated. Five graduated since then (dates are the TOC graduation dates recorded in
  `landscape.yml`; CNCF's public announcements came a few days to weeks later):

  | Project | Graduated | Section here |
  |---|---|---|
  | Cloud Native Buildpacks | 2026-07-17 (announced Aug 11) | CI/CD, GitOps & Autoscaling |
  | Kubeflow | 2026-07-24 (announced Aug 17) | App Runtime & Platform Abstractions |
  | Karmada | 2026-09-03 (announced Sep 7, KubeCon China) | Foundations & Orchestration |
  | NATS | 2026-11-02 (announced at KubeCon NA, Nov 2026) | App Runtime & Platform Abstractions |
  | KubeVirt | 2026-11-04 (announced Nov 10, KubeCon NA) | Foundations & Orchestration |

  If CNCF graduates a new project later, add it as a new sub-topic in the appropriate section.

## Structure
Kubernetes is the gravitational center of the CNCF ecosystem, so the landscape is organized by
**the job each project does around it**, roughly following how a request and its data flow
through a cloud-native platform:

1. **Foundations & Orchestration** — the container runtimes, the cluster datastore, the
   packaging tool, and Kubernetes itself — plus the projects that stretch what "a cluster" runs
   (virtual machines via KubeVirt) and how many clusters you orchestrate at once (Karmada). The
   substrate everything else assumes.
2. **Networking & Service Mesh** — how traffic gets routed, load-balanced, secured, and
   observed between services (proxies, meshes, eBPF dataplane, cluster DNS).
3. **Observability** — how you see what's happening: metrics, traces, and logs.
4. **CI/CD, GitOps & Autoscaling** — how source code becomes a container image, how desired
   state gets continuously delivered to clusters, and how workloads scale to demand.
5. **Security, Policy & Supply Chain** — runtime threat detection, admission policy, certificate
   automation, workload identity, and software-supply-chain integrity.
6. **App Runtime & Platform Abstractions** — higher-level developer platforms built on top of
   Kubernetes: distributed-app APIs, serverless, edge, eventing standards and messaging,
   control-plane building, and the ML/AI platform layer.
7. **Storage & Databases** — running stateful storage and databases the cloud-native way.
8. **Registry & Distribution** — storing, securing, scanning, and rapidly distributing images
   and artifacts.

These sections are a *reading aid*, not a hard sequence. Because it's a landscape you can start
anywhere, but the natural on-ramp for a Kubernetes person is Section 1 → 2 → 3.

## Sub-topics

### Foundations & Orchestration
1. **Kubernetes** (`kubernetes`)
   - **Covers:** The control-plane/node architecture (API server, scheduler, controller-manager,
     etcd, kubelet, kube-proxy), the declarative reconciliation model, and the core object model
     (Pods, Deployments, Services, controllers). Even for a Kubernetes user this reframes the
     project as *the* CNCF anchor and clarifies what belongs to Kubernetes vs. the ecosystem
     around it.
   - **Prerequisites:** none
   - **Interactive idea:** Clickable cluster-architecture diagram — click the API server,
     scheduler, kubelet, or etcd to highlight its role, then run a "schedule a Pod" animation
     that traces the request through each component.

2. **etcd** (`etcd`)
   - **Covers:** The strongly-consistent distributed key-value store that holds all Kubernetes
     cluster state. The Raft consensus algorithm (leader election, log replication, quorum),
     the watch/revision model, and why "quorum of an odd number of members" matters for HA.
   - **Prerequisites:** none
   - **Interactive idea:** Raft consensus visualizer — a small cluster of nodes where you can
     trigger elections, drop a leader, and step through log replication, watching quorum form.

3. **containerd** (`containerd`)
   - **Covers:** The industry-standard container runtime that actually pulls images, manages
     snapshots/layers, and supervises container lifecycles below Kubernetes. The OCI image and
     runtime specs, the relationship to runc, and how the CRI plugin plugs into the kubelet.
   - **Prerequisites:** none
   - **Interactive idea:** Container lifecycle stepper — walk an image from `pull` → unpack
     layers → create → `task start`, visualizing the overlay filesystem layer stack.

4. **CRI-O** (`cri-o`)
   - **Covers:** A lightweight container runtime built *specifically* for Kubernetes via the
     Container Runtime Interface — no more than Kubernetes needs. How CRI-O and containerd both
     satisfy the CRI, the runc/crun OCI runtime handoff, and why a Kubernetes-only runtime exists.
   - **Prerequisites:** containerd
   - **Interactive idea:** CRI request-flow diagram — trace a `RunPodSandbox`/`CreateContainer`
     call from kubelet through CRI-O to the OCI runtime, side-by-side with containerd's path.

5. **Helm** (`helm`)
   - **Covers:** The package manager for Kubernetes: charts, templates, values, releases, and
     the `helm install/upgrade/rollback` lifecycle. Templating with Go templates, chart
     dependencies, and why Helm exists versus raw `kubectl apply`.
   - **Prerequisites:** kubernetes
   - **Interactive idea:** Live template playground — edit a `values.yaml` on the left and watch
     the rendered Kubernetes manifest update on the right in real time.

6. **KubeVirt** (`kubevirt`)
   - **Covers:** Running full virtual machines *as Kubernetes workloads*, side by side with
     containers. The `VirtualMachine` / `VirtualMachineInstance` CRDs and the component chain
     that realizes them: virt-operator, virt-api, virt-controller, the per-node virt-handler
     DaemonSet, and the per-VM virt-launcher Pod that hosts libvirt + QEMU/KVM inside an
     ordinary Pod (so scheduling, networking, and storage are Kubernetes'). Disks via PVCs and
     the Containerized Data Importer (CDI) `DataVolume`, VM networking (pod network + Multus),
     and live migration. Why it graduated now: the post-Broadcom/VMware migration wave and the
     "one platform for VMs and containers" story — it's the engine under Red Hat OpenShift
     Virtualization and SUSE Harvester (graduated Nov 2026).
   - **Prerequisites:** kubernetes
   - **Interactive idea:** VM-in-a-Pod stack explorer + live-migration simulator — click down
     through node → virt-handler → virt-launcher Pod → libvirt/QEMU → guest OS to see which
     layer owns what; then trigger a live migration and watch pre-copy rounds transfer memory
     pages while the guest keeps dirtying them, with a dirty-rate vs. bandwidth slider that
     decides whether migration converges or needs to be throttled before the final cutover.

7. **Karmada** (`karmada`)
   - **Covers:** Multi-cluster, multi-cloud Kubernetes orchestration — "Kubernetes for your
     Kubernetes clusters." A separate Kubernetes-API-compatible control plane
     (karmada-apiserver, karmada-scheduler, karmada-controller-manager, its own etcd) that
     accepts *unmodified* native resource templates (a plain Deployment) and spreads them across
     member clusters via `PropagationPolicy`/`ClusterPropagationPolicy`, with per-cluster
     tweaks via `OverridePolicy`. The ResourceBinding → Work → member-cluster flow, Push vs. Pull
     (karmada-agent) cluster modes, replica scheduling (Duplicated vs. Divided, static and
     dynamic weights), cluster failover, and FederatedHPA. Lineage: what Kubernetes Federation
     (KubeFed) tried to be (graduated Sep 2026).
   - **Prerequisites:** kubernetes
   - **Interactive idea:** Propagation simulator — submit a Deployment with N replicas, pick a
     PropagationPolicy (Duplicated / Divided by static weight / Divided by available capacity)
     and watch replicas land across member clusters; add an OverridePolicy (per-region image
     registry) to see the per-cluster manifests diverge; then fail a cluster and watch Karmada
     reschedule its replicas onto the survivors.

### Networking & Service Mesh
8. **Envoy** (`envoy`)
   - **Covers:** The high-performance L4/L7 proxy that underpins most modern meshes and gateways.
     Listeners, filters, routes, clusters, and endpoints; the xDS dynamic configuration APIs;
     and why Envoy became the universal dataplane.
   - **Prerequisites:** none
   - **Interactive idea:** Request-routing simulator — send a request and watch it flow through
     a listener → filter chain → route match → cluster → endpoint, with editable route rules.

9. **Istio** (`istio`)
   - **Covers:** The most feature-complete service mesh: traffic management, mTLS security, and
     telemetry, built on Envoy sidecars (and now ambient/sidecar-less mode). The control plane
     (istiod), VirtualServices/DestinationRules, and how the mesh adds capability without app
     code changes.
   - **Prerequisites:** envoy
   - **Interactive idea:** Canary traffic-splitting slider — drag to shift traffic 90/10 → 50/50
     between two service versions and watch requests route accordingly on a live topology.

10. **Linkerd** (`linkerd`)
    - **Covers:** The deliberately minimal, security-first service mesh with its own ultralight
      Rust "micro-proxy" instead of Envoy. Automatic mTLS, golden metrics, and the design
      philosophy of simplicity/low overhead versus Istio's breadth.
    - **Prerequisites:** none
    - **Interactive idea:** Mesh comparison + golden-metrics dashboard — toggle mTLS and retries
      on a service call and watch success rate, latency, and RPS respond.

11. **Cilium** (`cilium`)
    - **Covers:** eBPF-powered networking, security, and observability for Kubernetes — a CNI that
      enforces identity-based network policy in the kernel, plus Hubble for flow visibility. What
      eBPF is and why moving networking into the kernel dataplane is transformative.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Network-policy simulator — draw pods with labels, add an eBPF-enforced
      policy, and watch which flows are allowed vs. dropped as packets traverse the kernel path.

12. **CoreDNS** (`coredns`)
    - **Covers:** The flexible, plugin-chained DNS server that provides service discovery inside
      Kubernetes (it's the cluster's DNS). The plugin architecture, the Corefile, and how a
      `svc.cluster.local` name resolves to a Service ClusterIP.
    - **Prerequisites:** none
    - **Interactive idea:** DNS resolution walk-through — enter a query and step through the
      configured plugin chain, watching each plugin decide whether to answer or pass along.

### Observability
13. **Prometheus** (`prometheus`)
    - **Covers:** The de facto metrics and alerting system: the pull-based scrape model, the
      dimensional data model (metrics + labels), PromQL, recording/alerting rules, and
      Alertmanager. The second project ever to graduate CNCF and the backbone of cloud-native
      monitoring.
    - **Prerequisites:** none
    - **Interactive idea:** PromQL query builder — run queries (rate, sum by, histogram_quantile)
      against a bundled sample time-series dataset and see the resulting graph live.

14. **OpenTelemetry** (`opentelemetry`)
    - **Covers:** The vendor-neutral standard for generating and collecting telemetry — traces,
      metrics, and logs — under one API/SDK and the OpenTelemetry Collector. Instrumentation,
      context propagation, the OTLP protocol, and why "OTel" unified a fractured observability
      space (graduated May 2026).
    - **Prerequisites:** prometheus
    - **Interactive idea:** Signal-pipeline builder — assemble receivers → processors → exporters
      in a Collector config and watch sample traces/metrics/logs flow and transform through it.

15. **Jaeger** (`jaeger`)
    - **Covers:** Distributed tracing: spans, traces, context propagation, and sampling, used to
      follow a single request across many microservices. The Jaeger architecture and its close
      relationship to OpenTelemetry as a tracing backend.
    - **Prerequisites:** opentelemetry
    - **Interactive idea:** Trace-waterfall explorer — inspect a multi-service trace as a
      waterfall of spans; expand spans, read tags, and spot the latency bottleneck.

16. **Fluentd** (`fluentd`)
    - **Covers:** The unified logging layer: collecting, parsing, buffering, and routing logs
      from many sources to many destinations. Inputs/filters/outputs, the tag-based routing
      model, buffering/retries, and Fluent Bit as the lightweight sibling.
    - **Prerequisites:** none
    - **Interactive idea:** Log-pipeline builder — feed sample raw log lines through an
      input → filter (parse/enrich) → output chain and watch records transform at each stage.

### CI/CD, GitOps & Autoscaling
17. **Argo** (`argo`)
    - **Covers:** The Argo project family — Argo CD (GitOps continuous delivery), Argo Workflows
      (Kubernetes-native DAG workflows), Argo Rollouts (progressive delivery), and Argo Events.
      The GitOps model of "Git as source of truth, controller reconciles the cluster to match."
    - **Prerequisites:** kubernetes
    - **Interactive idea:** GitOps sync animation — commit a change to a mock Git repo and watch
      Argo CD detect drift and reconcile the live cluster back to the desired state; plus a
      Workflows DAG runner.

18. **Flux** (`flux`)
    - **Covers:** The other major GitOps toolkit: the GitOps Toolkit controllers
      (source, kustomize, helm, notification), pull-based reconciliation, and how Flux compares
      to Argo CD. Continuous, declarative delivery driven from Git.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Reconciliation-loop simulator — change a manifest in a mock repo,
      then watch the source controller fetch, the kustomize controller build, and the cluster
      converge, on a timed loop.

19. **KEDA** (`keda`)
    - **Covers:** Kubernetes Event-Driven Autoscaling: scaling workloads (including to and from
      zero) based on external event sources — queue depth, stream lag, cron, custom metrics —
      via ScaledObjects and 60+ scalers. How it extends the Horizontal Pod Autoscaler.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Autoscaling simulator — turn a knob for incoming queue depth / event
      rate and watch replica count (including scale-to-zero) track the load over time.

20. **Cloud Native Buildpacks** (`buildpacks`)
    - **Covers:** Turning application source into OCI images *without a Dockerfile*. The
      Buildpacks spec and the `lifecycle` that executes it — analyze → detect → restore → build →
      export — where each buildpack opts in during detect, contributes layers during build, and
      layers are cached and reused across builds. Builders (buildpacks + lifecycle + build image),
      run images, the `pack` CLI and platform integrations (kpack on Kubernetes, CI systems), the
      generated SBOM, and `rebase`: patching the OS base layer of thousands of images by swapping
      layers in the registry with no rebuild. Implementations like Paketo and Heroku's buildpacks,
      and how this compares with hand-written Dockerfiles (graduated Jul 2026).
    - **Prerequisites:** containerd
    - **Interactive idea:** Lifecycle stepper — pick a sample app (Node / Java / Go), run detect
      to see which buildpacks in the builder's order groups opt in, step through build as each
      contributes labeled layers, and export the final image as a layer stack; then edit only app
      code and rebuild to see cached layers reused, and run `rebase` to watch just the run-image
      base layers get swapped.

### Security, Policy & Supply Chain
21. **Falco** (`falco`)
    - **Covers:** Runtime security threat detection: watching kernel syscalls (via eBPF) to
      detect suspicious behavior — a shell in a container, unexpected network connections,
      sensitive file reads — against a rule set. The "cloud-native intrusion detection" project.
    - **Prerequisites:** none
    - **Interactive idea:** Rule-matching simulator — replay a stream of syscall events and watch
      Falco rules fire alerts; edit a rule and see detection change.

22. **Open Policy Agent (OPA)** (`opa`)
    - **Covers:** A general-purpose policy engine that decouples policy decisions from services,
      using the Rego language. Admission control on Kubernetes (via Gatekeeper), plus policy for
      APIs, CI/CD, and more — "policy as code" everywhere.
    - **Prerequisites:** none
    - **Interactive idea:** Rego policy playground — provide an input JSON document and a Rego
      policy and see the allow/deny decision, with editable rules and live evaluation.

23. **Kyverno** (`kyverno`)
    - **Covers:** A Kubernetes-native policy engine where policies are themselves Kubernetes
      resources (YAML, no new language). Validation, mutation, generation, and image-verification
      policies; how it compares to OPA/Gatekeeper for admission control.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Policy simulator — apply a Kyverno policy to a sample resource and
      watch it validate (pass/fail), mutate (inject defaults), or generate companion resources.

24. **cert-manager** (`cert-manager`)
    - **Covers:** Automated X.509 certificate management in Kubernetes: Issuers/ClusterIssuers,
      Certificate resources, ACME (Let's Encrypt) with HTTP-01/DNS-01 challenges, and automatic
      renewal. How TLS "just works" declaratively in a cluster.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Certificate issuance flow — step through Issuer → CertificateRequest →
      ACME challenge → issued Secret, with a challenge-type picker and a renewal timeline.

25. **SPIFFE** (`spiffe`)
    - **Covers:** The Secure Production Identity Framework For Everyone — a *standard* for
      workload identity: SPIFFE IDs, trust domains, and SVIDs (X.509 and JWT). The problem of
      "how does one service prove who it is to another" without shared secrets.
    - **Prerequisites:** none
    - **Interactive idea:** Identity explorer — build a SPIFFE ID and trust domain, inspect an
      X.509 vs. JWT SVID, and map which workloads share a trust boundary.

26. **SPIRE** (`spire`)
    - **Covers:** The production *implementation* of SPIFFE: the SPIRE server and agents, node
      and workload attestation, and automatic SVID issuance/rotation. How a workload gets a
      cryptographic identity with zero embedded secrets.
    - **Prerequisites:** spiffe
    - **Interactive idea:** Attestation flow step-through — node attestation → workload
      attestation → SVID issuance, showing what evidence proves identity at each hop.

27. **in-toto** (`in-toto`)
    - **Covers:** Supply-chain integrity: cryptographically verifying that each step of a
      software build/release pipeline was carried out by the right party, in the right order,
      with the expected materials and products. Layouts, link metadata, and end-to-end
      verification.
    - **Prerequisites:** none
    - **Interactive idea:** Supply-chain layout graph — define pipeline steps, generate signed
      link metadata, then tamper with an artifact and watch verification catch it.

28. **The Update Framework (TUF)** (`tuf`)
    - **Covers:** A framework for securing software update systems against a wide range of
      attacks (key compromise, rollback, freeze, mix-and-match) via a hierarchy of signing roles
      and thresholds. The basis of secure delivery for many ecosystems (and Notary/Sigstore
      lineage).
    - **Prerequisites:** none
    - **Interactive idea:** Attack-defense simulator — pick an attack (rollback, key compromise,
      freeze) and see which TUF role/mechanism prevents it, toggling roles on and off.

### App Runtime & Platform Abstractions
29. **Dapr** (`dapr`)
    - **Covers:** The Distributed Application Runtime: a sidecar exposing building-block APIs —
      service invocation, state management, pub/sub, bindings, actors, secrets — over HTTP/gRPC,
      so app code stays infrastructure-agnostic. How Dapr abstracts distributed-systems plumbing.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Building-blocks explorer — a diagram of an app + Dapr sidecar; click
      a building block (state, pub/sub, service invocation) to see the API call and swappable
      component backend.

30. **Knative** (`knative`)
    - **Covers:** Serverless on Kubernetes: Knative Serving (request-driven autoscaling including
      scale-to-zero, revisions, traffic splitting) and Knative Eventing (event-driven glue).
      The developer-focused serverless application layer on Kubernetes (graduated Oct 2025).
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Scale-to-zero curve simulator — drive a request-rate signal and watch
      pods scale from zero, up under load, and back to zero when idle, with the cold-start moment.

31. **KubeEdge** (`kubeedge`)
    - **Covers:** Extending Kubernetes to the edge: running workloads on edge nodes with
      intermittent connectivity, cloud/edge components (CloudCore/EdgeCore), device management,
      and offline autonomy. Kubernetes orchestration where the network can't be trusted.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Cloud/edge sync diagram — cut the network link and watch the edge
      node keep running autonomously, then reconnect and reconcile state with the cloud.

32. **CloudEvents** (`cloudevents`)
    - **Covers:** A specification for describing event data in a common way, so events are
      portable across systems and tools. The CloudEvent attributes (id, source, type, spec
      version, data), format bindings, and why an event *envelope standard* matters.
    - **Prerequisites:** none
    - **Interactive idea:** Event-envelope builder — fill in CloudEvent attributes via a form and
      watch the conformant JSON (and HTTP binding) generate live, with validation.

33. **Crossplane** (`crossplane`)
    - **Covers:** Building control planes: managing cloud infrastructure (and more) as Kubernetes
      resources via Providers, Managed Resources, and Compositions/XRDs — a cloud-native
      alternative to Terraform that reconciles continuously. Platform teams offering
      self-service APIs.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Composition builder — define an XRD + Composition, submit a claim, and
      watch Crossplane fan it out into the underlying managed cloud resources it reconciles.

34. **NATS** (`nats`)
    - **Covers:** A lightweight, high-performance messaging system — one small Go server binary
      that does pub/sub, request-reply, and (with JetStream) persistent streaming. Core NATS:
      subject-based addressing with `*` / `>` wildcards, at-most-once fire-and-forget delivery,
      request-reply via inbox subjects, and queue groups for load-balanced consumers. JetStream:
      streams and consumers (push/pull, ack policies, redelivery, de-duplication), Raft-replicated
      storage, and the Key-Value and Object Store built on top of streams. Topology — clusters,
      superclusters via gateways, leaf nodes for edge — and multi-tenant accounts with
      decentralized JWT auth. How it compares with Kafka and RabbitMQ, and the 2025 Synadia /
      CNCF dispute over the project's future, resolved by Synadia transferring the trademark and
      NATS staying Apache-2.0 in CNCF (graduated Nov 2026).
    - **Prerequisites:** none
    - **Interactive idea:** Subject-routing playground — add subscribers on patterns like
      `orders.*.created` or `orders.>`, put some in a queue group, then publish messages and watch
      which subscribers receive them (fan-out vs. load-balanced); flip on JetStream to persist the
      subject into a stream, take a consumer offline, and watch it replay and ack the backlog when
      it reconnects.

35. **Kubeflow** (`kubeflow`)
    - **Covers:** The open-source AI/ML platform for Kubernetes — not one tool but a family of
      projects covering the model lifecycle. Kubeflow Pipelines (ML workflows as containerized
      DAGs, compiled from a Python SDK), Kubeflow Trainer (distributed training and LLM
      fine-tuning via `TrainJob` and reusable training runtimes, successor to the Training
      Operator's per-framework `PyTorchJob`-style CRDs), Katib (hyperparameter tuning / AutoML),
      Notebooks, Model Registry, the Spark Operator, and the multi-user dashboard/profiles layer.
      Where KServe fits (born in Kubeflow, now its own separate CNCF project for inference) and
      how Kubeflow compares with "just use a managed ML platform" (graduated Jul 2026).
    - **Prerequisites:** kubernetes
    - **Interactive idea:** ML-lifecycle pipeline explorer — a Kubeflow Pipelines DAG
      (ingest → preprocess → train → tune → register → serve) where clicking each step shows the
      Kubeflow component and Kubernetes resource behind it; plus a Katib tuning simulator that
      runs trials on a toy loss surface and compares random search against Bayesian optimization
      in how fast they find a good configuration.

### Storage & Databases
36. **Rook** (`rook`)
    - **Covers:** Storage orchestration for Kubernetes, primarily turning Ceph into a
      self-managing operator-driven storage system (block, file, object). How Rook automates
      deployment, scaling, and healing of distributed storage.
    - **Prerequisites:** kubernetes
    - **Interactive idea:** Storage-placement visualizer — write objects and watch Rook/Ceph
      distribute replicas across OSDs via CRUSH, then fail a node and watch it self-heal.

37. **CubeFS** (`cubefs`)
    - **Covers:** A cloud-native distributed file and object storage system: the separation of
      metadata and data nodes, multi-tenancy, and use cases from ML/big-data to container
      storage. An alternative architecture to Ceph-based storage.
    - **Prerequisites:** none
    - **Interactive idea:** Architecture explorer — trace a file write through the client →
      metadata node (inode/dentry) → data nodes (replicas/erasure coding), toggling replication
      modes.

38. **TiKV** (`tikv`)
    - **Covers:** A distributed transactional key-value database: multi-Raft regions, automatic
      sharding and rebalancing, MVCC, and distributed transactions (Percolator model). The
      storage engine behind TiDB and a general-purpose distributed KV store.
    - **Prerequisites:** etcd
    - **Interactive idea:** Region/multi-Raft visualizer — insert keys and watch them map into
      Raft regions that split and rebalance across nodes as data and load grow.

39. **Vitess** (`vitess`)
    - **Covers:** Horizontal scaling for MySQL: sharding, connection pooling, and query routing
      via VTGate/VTTablet while staying MySQL-compatible. How Vitess (born at YouTube) scales
      relational databases without rewriting the app.
    - **Prerequisites:** none
    - **Interactive idea:** Sharding simulator — issue queries and watch VTGate route them to the
      right shard(s) by sharding key, including a scatter-gather query across all shards.

### Registry & Distribution
40. **Harbor** (`harbor`)
    - **Covers:** An enterprise container/artifact registry: RBAC, vulnerability scanning, image
      signing/policy, replication between registries, and OCI-artifact storage. The trusted
      registry that adds security and governance on top of the OCI distribution spec.
    - **Prerequisites:** containerd
    - **Interactive idea:** Push-scan-sign pipeline — push an image and watch it get scanned for
      CVEs, signed, and gated by a policy that can block a vulnerable pull.

41. **Dragonfly** (`dragonfly`)
    - **Covers:** Peer-to-peer image and file distribution: accelerating and stabilizing the
      delivery of large images/artifacts at scale by having nodes share pieces with each other
      instead of hammering a central registry. The P2P distribution layer (graduated Jan 2026).
    - **Prerequisites:** harbor
    - **Interactive idea:** P2P distribution animation — compare a traditional "everyone pulls
      from the registry" pattern against Dragonfly's seed → peer-to-peer swarm, watching load on
      the origin and total download time.
