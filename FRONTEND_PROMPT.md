# React Frontend Development Prompt for Drug Interaction System

## Project Overview
Build a modern, interactive React frontend application for a Drug Interaction Management System. This system consists of 4 microservices that need to be integrated into different sections of the frontend. The application should have a beautiful, user-friendly UI with excellent UX practices, including proper error handling, loading states, and responsive design.

## Architecture & Microservices

The backend consists of 4 microservices running on different ports:
1. **Eureka Server** - Service Discovery (Port 8761) - No direct API calls needed
2. **Drug Database Service** - Port 9001
3. **Interaction Service** - Port 9002
4. **Prescription Service** - Port 9003

## Frontend Structure Requirements

The frontend should be organized into distinct sections/modules for each microservice:

### Section 1: Drug Database Management
### Section 2: Drug Interaction Analysis
### Section 3: Prescription Management
### Section 4: Dashboard/Overview (Optional but recommended)

---

## API Endpoints & Integration Details

### 1. DRUG DATABASE SERVICE (Base URL: http://localhost:9001)

#### Endpoints:

**GET /drugs**
- **Purpose**: Retrieve all drugs from the database
- **Response**: Array of Drug objects
- **Drug Object Structure**:
  ```json
  {
    "id": number,
    "name": string,
    "category": string,
    "dosageMg": number,
    "sideEffects": string[]
  }
  ```
- **UI Requirement**: Display in a searchable, filterable table with pagination. Include columns: Name, Category, Dosage (mg), Side Effects (as tags/badges)

**GET /drugs/{id}**
- **Purpose**: Get a single drug by ID
- **Response**: Single Drug object
- **UI Requirement**: Show detailed drug information in a modal or detail view

**POST /drugs**
- **Purpose**: Create a new drug
- **Request Body**:
  ```json
  {
    "name": string (required),
    "category": string (required),
    "dosageMg": number (required),
    "sideEffects": string[] (optional)
  }
  ```
- **UI Requirement**: Form with validation. Include:
  - Text input for name
  - Text input or dropdown for category
  - Number input for dosage (mg)
  - Multi-select or tag input for side effects (allow adding multiple)

**POST /drugs/bulk**
- **Purpose**: Bulk import drugs
- **Request Body**: Array of Drug objects (same structure as POST /drugs)
- **UI Requirement**: File upload (CSV/JSON) or multi-row form for bulk entry. Show progress indicator during upload.

**PUT /drugs/{id}**
- **Purpose**: Update an existing drug
- **Request Body**: Same as POST /drugs
- **UI Requirement**: Pre-populated form with existing data, allow editing all fields

**DELETE /drugs/{id}**
- **Purpose**: Delete a drug
- **Response**: String message "Deleted drug with id: {id}"
- **UI Requirement**: Confirmation dialog before deletion, show success/error message

---

### 2. INTERACTION SERVICE (Base URL: http://localhost:9002)

#### Endpoints:

**GET /interactions/analyze?drugA={id}&drugB={id}**
- **Purpose**: Analyze interaction between two drugs
- **Query Parameters**: 
  - `drugA`: Long (drug ID)
  - `drugB`: Long (drug ID)
- **Response**: InteractionResultDTO
  ```json
  {
    "drugA": string,
    "drugB": string,
    "riskLevel": "SAFE" | "MODERATE" | "HIGH" | "CRITICAL",
    "severityScore": number (0-100),
    "message": string
  }
  ```
- **UI Requirement**: 
  - Two drug selectors (dropdowns populated from Drug Database Service)
  - "Analyze Interaction" button
  - Display results in a visually appealing card:
    - Risk level with color coding (Green=SAFE, Yellow=MODERATE, Orange=HIGH, Red=CRITICAL)
    - Severity score with progress bar or gauge
    - Detailed message
    - Visual indicators (icons, badges)

**GET /health**
- **Purpose**: Health check
- **Response**: String "Interaction Service: OK"
- **UI Requirement**: Show service status indicator in header/footer

**GET /demo/intro**
- **Purpose**: Demo endpoint
- **Response**: String message
- **UI Requirement**: Optional - can be used for help/tutorial section

**GET /demo/features**
- **Purpose**: Demo endpoint
- **Response**: String message
- **UI Requirement**: Optional - can be used for help/tutorial section

---

### 3. PRESCRIPTION SERVICE (Base URL: http://localhost:9003)

#### Endpoints:

**POST /prescriptions**
- **Purpose**: Create a new prescription
- **Request Body**: Prescription object
  ```json
  {
    "patientName": string (required),
    "doctorName": string (required),
    "items": [
      {
        "drugId": number (required),
        "doseMg": number (required)
      }
    ]
  }
  ```
- **Response**: Prescription object with generated ID and interaction summary
  ```json
  {
    "id": number,
    "patientName": string,
    "doctorName": string,
    "createdAt": string (ISO datetime),
    "items": PrescriptionItem[],
    "interactionSummary": string
  }
  ```
- **UI Requirement**: 
  - Form with patient name and doctor name inputs
  - Dynamic list to add multiple prescription items
  - For each item: drug selector (from Drug Database Service) and dosage input
  - "Add Drug" button to add more items
  - "Create Prescription" button
  - After creation, display the interaction summary prominently
  - Show warnings/alerts if interactions are detected

**GET /prescriptions**
- **Purpose**: Get all prescriptions
- **Response**: Array of Prescription objects
- **UI Requirement**: 
  - Table or card grid showing all prescriptions
  - Columns/cards should show: Patient Name, Doctor Name, Date Created, Number of Drugs, Interaction Status
  - Click to view details
  - Filter and search functionality

**GET /prescriptions/{id}**
- **Purpose**: Get prescription by ID
- **Response**: Single Prescription object
- **UI Requirement**: 
  - Detailed view showing:
    - Patient and doctor information
    - List of all drugs with dosages
    - Full interaction summary (formatted nicely)
    - Created date/time
  - Edit and Delete buttons

**PUT /prescriptions/{id}**
- **Purpose**: Update prescription
- **Request Body**: Same as POST /prescriptions
- **UI Requirement**: Pre-populated form, same as create form but with existing data

**DELETE /prescriptions/{id}**
- **Purpose**: Delete prescription
- **Response**: String "Deleted"
- **UI Requirement**: Confirmation dialog, show success message

**POST /prescriptions/validate**
- **Purpose**: Validate prescription without saving
- **Request Body**: Same as POST /prescriptions (without ID)
- **Response**: String (interaction summary)
- **UI Requirement**: 
  - "Validate" button in prescription form
  - Show validation results in real-time
  - Display warnings/errors before submission
  - Color-coded alerts based on risk level

---

## UI/UX Requirements

### Design Principles:
1. **Modern & Clean**: Use a modern design system (Material-UI, Ant Design, or Tailwind CSS)
2. **Responsive**: Mobile-first approach, works on all screen sizes
3. **Color Coding**: 
   - SAFE interactions: Green
   - MODERATE interactions: Yellow/Orange
   - HIGH interactions: Orange/Red
   - CRITICAL interactions: Red
4. **Loading States**: Show spinners/skeletons during API calls
5. **Error Handling**: User-friendly error messages with retry options
6. **Success Feedback**: Toast notifications or inline success messages
7. **Form Validation**: Client-side validation with helpful error messages

### Navigation Structure:
- **Top Navigation Bar** with:
  - Logo/Brand name
  - Links to: Dashboard, Drug Database, Interaction Analyzer, Prescriptions
  - Service status indicators (health checks)
  - User info (if authentication is added later)

### Section Layouts:

#### 1. Drug Database Section:
- **Header**: "Drug Database Management"
- **Actions Bar**: 
  - "Add New Drug" button
  - "Bulk Import" button
  - Search bar
  - Filter by category dropdown
- **Main Content**: 
  - Table/Grid of drugs with actions (View, Edit, Delete)
  - Pagination
  - Empty state when no drugs

#### 2. Interaction Analyzer Section:
- **Header**: "Drug Interaction Analyzer"
- **Main Content**:
  - Two-column layout or side-by-side drug selectors
  - Large "Analyze Interaction" button
  - Results panel below with:
    - Risk level badge (large, prominent)
    - Severity score visualization (gauge/progress bar)
    - Detailed message in expandable section
    - Recommendations (if any)
- **History**: Optional - show recent analyses

#### 3. Prescription Management Section:
- **Header**: "Prescription Management"
- **Actions Bar**: 
  - "Create New Prescription" button
  - Search/filter prescriptions
- **Main Content**:
  - List/Grid of prescriptions
  - Create/Edit form (modal or separate page)
  - Detail view for individual prescriptions
- **Features**:
  - Real-time validation while building prescription
  - Visual warnings for drug interactions
  - Interaction summary display

#### 4. Dashboard Section (Recommended):
- **Overview Cards**: 
  - Total drugs count
  - Total prescriptions count
  - Recent interactions analyzed
  - System health status
- **Recent Activity**: 
  - Latest prescriptions
  - Recent drug additions
  - Recent interaction analyses
- **Quick Actions**: 
  - Quick links to create drug, analyze interaction, create prescription

### Component Requirements:

1. **DrugCard/DrugRow**: Display drug information with actions
2. **DrugForm**: Create/Edit drug form with validation
3. **BulkImport**: File upload or multi-row input for bulk drug import
4. **InteractionAnalyzer**: Two drug selectors + analyze button + results display
5. **PrescriptionForm**: Dynamic form for creating/editing prescriptions
6. **PrescriptionCard/Row**: Display prescription summary
7. **PrescriptionDetail**: Full prescription view with interaction summary
8. **RiskBadge**: Color-coded risk level indicator
9. **SeverityGauge**: Visual representation of severity score
10. **LoadingSpinner**: Reusable loading component
11. **ErrorMessage**: Reusable error display component
12. **SuccessToast**: Notification for successful operations

### State Management:
- Use React Context API or Redux for:
  - Drug list (cache to avoid repeated API calls)
  - Prescription list
  - Service health status
  - User preferences (if any)

### API Integration:
- Create a centralized API service/client:
  - `api/drugService.js` - All drug database endpoints
  - `api/interactionService.js` - All interaction endpoints
  - `api/prescriptionService.js` - All prescription endpoints
- Use axios or fetch with proper error handling
- Implement request interceptors for loading states
- Implement response interceptors for error handling

### Additional Features to Include:

1. **Search & Filter**:
   - Search drugs by name
   - Filter drugs by category
   - Search prescriptions by patient/doctor name
   - Filter prescriptions by date range

2. **Data Visualization**:
   - Chart showing drug categories distribution
   - Chart showing interaction risk levels distribution
   - Timeline of prescriptions

3. **Export Functionality**:
   - Export drug list to CSV/JSON
   - Export prescription to PDF (optional)
   - Print prescription

4. **Keyboard Shortcuts** (Optional):
   - Quick navigation between sections
   - Quick actions (Ctrl+N for new, etc.)

5. **Dark Mode** (Optional but recommended):
   - Toggle between light and dark themes

## Technical Stack Recommendations:

- **React**: Latest version (18+)
- **Routing**: React Router v6
- **UI Library**: Material-UI, Ant Design, or Chakra UI
- **Styling**: CSS Modules, Styled Components, or Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form or Formik
- **State Management**: Context API or Redux Toolkit
- **Charts**: Recharts or Chart.js (for visualizations)
- **Icons**: React Icons or Material Icons
- **Date Handling**: date-fns or moment.js

## Error Handling:

- Network errors: Show user-friendly message with retry button
- Validation errors: Show inline errors in forms
- 404 errors: Show "Not Found" message
- 500 errors: Show "Server Error" with contact information
- Timeout errors: Show timeout message with retry option

## Performance Considerations:

- Implement pagination for large lists
- Use React.memo for expensive components
- Lazy load routes
- Debounce search inputs
- Cache API responses where appropriate
- Optimize images/assets

## Testing Requirements (Optional but recommended):

- Unit tests for utility functions
- Integration tests for API calls
- Component tests for critical UI components

---

## Example API Service Structure:

```javascript
// api/drugService.js
const BASE_URL = 'http://localhost:9001';

export const drugService = {
  getAllDrugs: () => axios.get(`${BASE_URL}/drugs`),
  getDrugById: (id) => axios.get(`${BASE_URL}/drugs/${id}`),
  createDrug: (drug) => axios.post(`${BASE_URL}/drugs`, drug),
  updateDrug: (id, drug) => axios.put(`${BASE_URL}/drugs/${id}`, drug),
  deleteDrug: (id) => axios.delete(`${BASE_URL}/drugs/${id}`),
  bulkCreateDrugs: (drugs) => axios.post(`${BASE_URL}/drugs/bulk`, drugs),
};
```

Similar structure for `interactionService.js` and `prescriptionService.js`.

---

## Deliverables:

1. Complete React application with all sections
2. All API endpoints integrated
3. Responsive design
4. Error handling throughout
5. Loading states
6. Form validations
7. README.md with setup instructions
8. package.json with all dependencies

---

## Notes:

- All dates should be formatted in a user-friendly way
- Numbers (dosage, severity scores) should be formatted appropriately
- Side effects should be displayed as tags/badges
- Interaction summaries should be formatted with proper line breaks
- Consider adding tooltips for help text
- Add confirmation dialogs for destructive actions (delete)
- Implement optimistic updates where appropriate for better UX


