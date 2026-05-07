# Kognio — System Diagrams

---

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Frontend (React + Vite)"]
        UI[React UI]
        AC[AuthContext]
        IC[InventoryContext]
        SVC[Services Layer<br/>api.js / authService / chatService / productService]
    end

    subgraph Server["⚙️ Backend (Node.js + Express)"]
        API[Express Server<br/>server.js]
        subgraph Routes
            AR[/api/auth]
            PR[/api/products]
            SR[/api/stock]
            CR[/api/chat]
            IR[/api/invoices]
            RR[/api/reports]
        end
        subgraph Controllers
            AC2[authController]
            PC[productController]
            SC[stockController]
            CC[chatController]
        end
        subgraph Services
            CS[chatService]
            AS[alertService]
            RS[reportService]
            SS[sessionStateService]
        end
        MW[JWT Auth Middleware]
    end

    subgraph External["☁️ External Services"]
        GROQ[Groq AI API<br/>llama-3.3-70b]
        MAIL[Gmail SMTP<br/>Nodemailer]
    end

    subgraph DB["🗄️ MongoDB Atlas"]
        U[(Users)]
        P[(Products)]
        T[(Transactions)]
        AL[(Alerts)]
        IN[(Invoices)]
        CA[(Categories)]
    end

    UI --> SVC
    SVC -->|HTTP + JWT| API
    API --> MW --> Routes
    AR --> AC2
    PR --> PC
    SR --> SC
    CR --> CC
    CC --> CS
    CS -->|Intent Parsing| GROQ
    PC --> AS
    SC --> AS
    AC2 -->|Reset Email| MAIL
    PC & SC & CC --> DB
    AC2 --> U
```

---

## 2. Sequence Diagram

### 2a. User Login Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as Express API
    participant DB as MongoDB

    User->>FE: Enter email & password
    FE->>API: POST /api/auth/login
    API->>DB: findOne({ email })
    DB-->>API: User document
    API->>API: bcrypt.compare(password)
    alt Valid credentials
        API-->>FE: { token, user }
        FE->>FE: Store token in AuthContext
        FE-->>User: Redirect to /dashboard
    else Invalid credentials
        API-->>FE: 401 Invalid credentials
        FE-->>User: Show error message
    end
```

### 2b. AI Chat Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as ChatInterface
    participant API as Express API
    participant CS as chatService
    participant GROQ as Groq AI
    participant DB as MongoDB

    User->>FE: Type message (e.g. "add 10 laptops")
    FE->>API: POST /api/chat { message, sessionId }
    API->>CS: chat(message, sessionId)
    CS->>CS: Check cancel / greeting
    CS->>DB: Product.find() — get inventory summary
    DB-->>CS: Products list
    CS->>GROQ: parseIntent(message, inventorySummary)
    GROQ-->>CS: { action, product_name, quantity }
    CS->>CS: validateIntent()
    CS-->>API: { type: "command", action: "add_stock", ... }
    API->>DB: Update product quantity
    API->>DB: Create Transaction record
    API->>DB: checkAndCreateAlert()
    API-->>FE: { type: "command", response: "Added 10 units..." }
    FE-->>User: Display AI response
```

### 2c. Stock Management Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as Express API
    participant SC as stockController
    participant AS as alertService
    participant DB as MongoDB

    User->>FE: Add / Remove stock
    FE->>API: POST /api/stock/add or /remove
    API->>API: JWT Middleware verify token
    API->>SC: addStock / removeStock
    SC->>DB: Product.findById()
    DB-->>SC: Product
    SC->>DB: Update product.quantity
    SC->>DB: Transaction.create()
    SC->>AS: checkAndCreateAlert(product)
    alt quantity == 0
        AS->>DB: Alert.create({ type: "out_of_stock" })
    else quantity <= minStockLevel
        AS->>DB: Alert.create({ type: "low_stock" })
    end
    API-->>FE: Updated product
    FE-->>User: Show updated stock
```

---

## 3. Activity Diagram

### 3a. User Authentication Activity

```mermaid
flowchart TD
    A([Start]) --> B[User visits app]
    B --> C{Has JWT token?}
    C -->|No| D[Redirect to /login]
    C -->|Yes| E[Load Dashboard]
    D --> F[Enter credentials]
    F --> G[POST /api/auth/login]
    G --> H{Valid credentials?}
    H -->|No| I[Show error]
    I --> F
    H -->|Yes| J[Store JWT token]
    J --> E
    E --> K([End])
```

### 3b. AI Chat Command Activity

```mermaid
flowchart TD
    A([Start]) --> B[User sends message]
    B --> C{Is cancel command?}
    C -->|Yes| D[Clear session state]
    D --> Z([End])
    C -->|No| E{Is greeting?}
    E -->|Yes| F[Return welcome message]
    F --> Z
    E -->|No| G{Active session state?}
    G -->|Yes| H[Continue multi-step flow]
    H --> Z
    G -->|No| I{Multiple commands?}
    I -->|Yes| J[Split by AND / comma]
    J --> K[Parse each command via Groq AI]
    K --> L[Execute batch commands]
    L --> Z
    I -->|No| M[Parse intent via Groq AI]
    M --> N{Valid intent?}
    N -->|No| O[Return error message]
    O --> Z
    N -->|Yes| P{Action type?}
    P -->|add_stock| Q[Add stock + log transaction]
    P -->|remove_stock| R[Remove stock + log transaction]
    P -->|create_product| S[Create new product]
    P -->|list_products| T[Return product list]
    P -->|inventory_value| U[Calculate total value]
    P -->|low_stock| V[Find low stock items]
    P -->|update_product| W[Update product details]
    P -->|delete_product| X[Delete product]
    Q & R --> Y[Check & create stock alert]
    Y --> Z
    S & T & U & V & W & X --> Z
```

### 3c. Invoice Generation Activity

```mermaid
flowchart TD
    A([Start]) --> B[User opens Invoice page]
    B --> C[Fill invoice details<br/>customer, items, quantities]
    C --> D[Submit invoice form]
    D --> E[POST /api/invoices]
    E --> F[Save invoice to MongoDB]
    F --> G{Export PDF?}
    G -->|Yes| H[Generate PDF via jsPDF + html2canvas]
    H --> I[Download PDF]
    G -->|No| J[View in InvoiceList]
    I --> K([End])
    J --> K
```

---

## 4. Use Case Diagram

```mermaid
graph LR
    subgraph Actors
        U((User))
        A((Admin))
        AI((Groq AI))
    end

    subgraph Kognio System
        UC1[Register / Login]
        UC2[Forgot & Reset Password]
        UC3[View Dashboard]
        UC4[Manage Products<br/>Add / Edit / Delete]
        UC5[Manage Stock<br/>Add / Remove]
        UC6[AI Chat Assistant]
        UC7[Voice Input]
        UC8[View Reports & Analytics]
        UC9[Generate Report PDF]
        UC10[Create Invoice]
        UC11[View Invoice List]
        UC12[Export Invoice PDF]
        UC13[View Low Stock Alerts]
        UC14[Dismiss Alerts]
    end

    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8
    U --> UC9
    U --> UC10
    U --> UC11
    U --> UC12
    U --> UC13

    A --> UC1
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC13
    A --> UC14

    UC6 -->|Intent Parsing| AI
    UC7 -->|Speech to Text| UC6
```
