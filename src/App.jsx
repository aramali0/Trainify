import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BlogDetails from './pages/BlogDetails';
import Blog from './pages/Blog-grid-two-columns';
import Contact from './pages/Contact';
import Event from './pages/Event';
import EventList from './pages/EventList';
import FAQ from './pages/FAQ';
import InstructorDetails from './pages/InstructorPage';
import InstructorsSection from './pages/InstructoePage';
import PortfolioDetails from './components/portfolio/PortfolioPage';
import PortfolioSection from './pages/ProfolioSection';
import Pricing from './pages/Pricing';
import Header from './components/Header';
import Footer from './components/Foooter';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './pages/Unauthorized';
import Login from './pages/Login';
import ComingSoon from './pages/ComingSonn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { EmailProvider } from './context/EmailContext';
import RoleSelection from './components/RoleSection';
import ChatPage from './pages/chatPage';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/DashBoard';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePassword';
import StudentsPage from './pages/StudentPage';
import InstructorsPage from './pages/InstructorsPage';
import EditCoursePage from './pages/UpdateCoursePage';
import AddCoursePage from './pages/AddCoursePage';
import SessionsPage from './pages/SessionPage';
import AddSessionPage from './pages/AddSessionPage';
import EditSessionPage from './pages/EditSessionPage';
import SectionsPage from './pages/SectionsPage';
import AddSectionPage from './pages/AddSectionPage';
import EditSectionPage from './pages/EditSectionPage';
import CreateQuizPage from './pages/CreateQuizePage';
import ViewQuizPage from './pages/ViewQuizePage';
import EditQuizPage from './pages/EditQuizePage';
import EditQuestionPage from './pages/EditQuestionPage';
import CalendarPage from './pages/CalenderPage';
import LibraryPage from './pages/LibraryPage';
import CreateLibraryPage from './components/CreateLibraryPage';
import ClassPage from './pages/ClassPage';
import CreateClassPage from './pages/createClassPage';
import EditClassPage from './pages/EditClass';
import CoursesPage from './pages/CoursesPage';
import DashboardCard from './components/Dashboard/DashBoardCard';
import DashboardFormateur from './pages/formateur/DashboardFormateur';
import QuizPage from './pages/QuizePage';
import ResultPage from './pages/ResultPage';
import EvulationPage from './pages/EvulationPage';
import CreateConferencePage from './pages/CreateConferencePage';
import ConferencePage from './pages/ConferencePage';
import DashboardParticipant from './pages/DashbroardParticipant';
import LibrariesAndResourcesPage from './pages/LibrariesAndResourcesPage';
import EvaluationDetails from './pages/EvaluationDetails';
import UploadCertificatePage from './pages/UplaodCertificatePage';
import CertificatesPage from './pages/CertificatePage';
import AddUserPage from './pages/AddUserPage';
import AdminLayout from './pages/AdminLayout';
import AddAdminPage from './pages/AddAdminPage';
import DashboardAdmin from './pages/DashBoardAdmin';
import UsersPage from './pages/UsersPage';
import UpdateUserPage from './pages/UpdateUserPage';
import BannersPage from './pages/BannersPage';
import CreateBanner from './pages/CreateBanner';
import UpdateBanner from './pages/UpdateBanner';
import AdminAboutUsPage from './pages/AdminAboutUsPage';
import EventListPage from './components/EventListPage';
import CreateEventPage from './components/CreateEventPage';
import UpdateEventPage from './components/UpdateEvenPage';
import AdminMessagesPage from './components/AdminMessagesPage';
import ContactInfoPage from './components/ContactInfoPage';
import AdminPricingPanel from './pages/AdminPricingPanel';
import Checkout from './pages/Checkout';
import PaymentsList from './pages/PayementList';
import Success from './pages/Success';
import FeedbackForm from './pages/FeeBackForm';
import AdminFeedbackView from './pages/AdminFeeBackView';
import AddParticipantPage from './pages/AddParticipantPage';
import CodeVerificationPage from './pages/CodeVerificationPage';
import ParticipantsPage from './pages/participantsPage';
import UpdateCoursePage from './pages/UpdateCoursePage';
import EntreprisesPage from './pages/EntreprisesPage';
import UpdateEntreprisePage from './pages/UpdataEntreprisePage';
import AddEntreprisePage from './pages/AddEntreprise';
import AddUserResponsablePage from './pages/AddUserResponsablePage';
import AddResponsableAndEntreprisePage from './pages/AddResponsableAndEntreprisePage';
import ParticipantsAdminPage from './pages/ParticipantsAdminPage';
import FormateursAdminPage from './pages/FormateurAdminPage';
import ResponsableFormationPage from './pages/ResponsanleFormation';
import QuestionAnswersPage from './pages/QuestionAnswersPage';
import ApprovalActionsPage from './pages/ApprovalActionPage';
import ChargeFormationApprovalsPage from './pages/ChargeFormationAprovalPage';
import EvaluationResponsesPage from './pages/EvaluationResponsesPage';
import EvaluationListPage from './pages/EvaluationListPage';
import CreateEvaluationPage from './pages/CreateEvaluationPage';
import EvaluationListForUserPage from './pages/EvaluationListForUserPage';
import AnswerEvaluationPage from './pages/AnswerEvaluationPage';

function App() {
  return (
    <EmailProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/add-user" element={<AddParticipantPage />} />
          <Route path="/activation/:email" element={<CodeVerificationPage />} />
          <Route path="/entreprises/responsable/add" element={<AddResponsableAndEntreprisePage/>} /> 


          {/* Main application routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/event-list" element={<EventList />} />
            <Route path="/instructors" element={<InstructorsSection />} />
            <Route path="/portfolio" element={<PortfolioSection />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          <Route element={<PrivateRoute roles={['ROLE_ADMIN', 'ROLE_FORMATEUR', 'ROLE_RESPONSABLE', 'ROLE_PARTICIPANT','ROLE_CHARGE']} />}>
            <Route path="/choose-role" element={<RoleSelection />} />
            <Route path="/success" element={<Success />} />
            <Route path="/feeback-form" element={<FeedbackForm />} />
          </Route>
 

          <Route element={<PrivateRoute roles={['ROLE_ADMIN']} />}>
            <Route path="/admin/chat/*" element={<ChatPage path="/admin" nom="/admin" />} />
            <Route path='/admin' element={<AdminLayout />} >
              <Route index element={<DashboardAdmin />} /> 
              <Route path="add-admin" element={<AddAdminPage />} />
              <Route path="add-user" element={<AddUserPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:entrepriseId" element={<UsersPage />} />
              <Route path="update/:id" element={<UpdateUserPage />} />
              <Route path="courses" element={<CoursesPage nom="/admin" />} />
              <Route path="courses/:courseId/sessions" element={<SessionsPage nom="/admin" />} />
              <Route path="sections/:sessionId" element={<SectionsPage nom="/admin" />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="banners/create" element={<CreateBanner />} />
              <Route path="banners/update/:id" element={<UpdateBanner />} />
              <Route path="about-us" element={<AdminAboutUsPage />} />
              <Route path="events" element={<EventListPage />} />
              <Route path="create-event" element={<CreateEventPage />} />
              <Route path="update-event/:id" element={<UpdateEventPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="contact-info" element={<ContactInfoPage />} />
              <Route path="pricing" element={<AdminPricingPanel />} />
              <Route path="payments" element={<PaymentsList />} />
              <Route path="feedbacks" element={<AdminFeedbackView />} />
              <Route path="profile" element={<ProfilePage />} /> {/* Charts Route */}
              <Route path="change-password" element={<ChangePasswordPage />} /> {/* Charts Route */}
              <Route path="courses/update/:id" element={<UpdateCoursePage nom = "/admin"/>} />
              <Route path="courses/add" element={<AddCoursePage nom="admin" path="/responsable"/>} />
              <Route path="entreprises" element={<EntreprisesPage/>} />
              <Route path="entreprises/add" element={<AddEntreprisePage/>} />
              <Route path="entreprises/update/:id" element={<UpdateEntreprisePage/>} /> 
              <Route path="participant/:entrepriseId" element={<ParticipantsAdminPage/>} />
              <Route path="formateur/:entrepriseId" element={<FormateursAdminPage/>} />
              <Route path="responsable/:entrepriseId" element={<ResponsableFormationPage/>} /> 
              <Route path="library" element={<LibraryPage nom="/admin" user="admin"  path="/admin"/>} /> 
            </Route>
          </Route>

          <Route element={<PrivateRoute roles={['ROLE_RESPONSABLE']} />}>
              <Route path="/responsable/chat/*" element={<ChatPage path="/responsables" nom="/responsable" />} />
            <Route path="/responsable" element={<DashboardLayout role="Responsable" nom="/responsable" />}>
              <Route index element={<Dashboard path="/responsables" nom="/responsable" />} /> {/* Default Dashboard Route */}
              <Route path="profile" element={<ProfilePage />} /> {/* Charts Route */}
              <Route path="students" element={<StudentsPage path="/responsables" />} /> {/* Charts Route */}
              <Route path="courses" element={<CoursesPage path="/responsables" nom="/responsable" />} /> {/* Charts Route */}
              <Route path="instructors" element={<InstructorsPage  path="/responsables" nom="/responsable"/>} /> {/* Charts Route */}//type de formateur dosnt work
              <Route path="change-password" element={<ChangePasswordPage />} /> {/* Charts Route */}
              <Route path="courses/add" element={<AddCoursePage nom="responsable" path="/responsables" />} />
              <Route path="courses/:courseId/sessions" element={<SessionsPage nom="/responsable" path="/responsables" />} />
              <Route path="sessions" element={<SessionsPage nom="/responsable" path="/responsables" />} />
              <Route path="sessions/add" element={<AddSessionPage  path="/responsables" />} />
              <Route path="sessions/edit/:id" element={<EditSessionPage nom="/responsable" path="/responsables" />} />
              <Route path="sections/:sessionId" element={<SectionsPage nom="/responsable" path="/responsables" />} />
              <Route path="sections" element={<SectionsPage nom="/responsable" path="/responsables" />} />
              <Route path="sections/add" element={<AddSectionPage  path="/responsables" nom="/responsable"/>} />
              <Route path="sections/edit/:id" element={<EditSectionPage  path="/responsables" nom="/responsable" />} />
              <Route path="sections/:sectionId/create-quiz" element={<CreateQuizPage nom="/responsable" />} />
              <Route path="sections/:sectionId/quiz/:quizId" element={<ViewQuizPage nom="/responsable" />} />
              <Route path="quiz/:quizId/edit-quiz" element={<EditQuizPage nom="/responsable" />} /> //add the delete option to the json file 
              <Route path="questions/edit/:questionId" element={<EditQuestionPage nom="/responsable" />} />
              <Route path="calendar" element={<CalendarPage path="/responsables" />} /> //needs some work
              <Route path="courses/:courseId/create-library" element={<CreateLibraryPage />} />
              <Route path="courses/:courseId/library" element={<LibraryPage nom="/responsable" user="responsable" path="/responsables" />} /> 
              <Route path="library" element={<LibraryPage nom="/responsable" user="responsable" />} /> 
              <Route path="courses/update/:id" element={<UpdateCoursePage path='/responsables' nom = "/responsable"/>} />
              <Route path="classes" element={<ClassPage nom="/responsable" path="/responsables" />} />
              <Route path="create-class" element={<CreateClassPage nom="/responsable" path="/responsables" />} />
              <Route path="edit-class/:id" element={<EditClassPage nom="/responsable" path="/responsables" />} />
              <Route path="latest-evaluations" element={<EvulationPage path="/responsables" nom="/responsable" />} /> 
              <Route path="upload-certificate" element={<UploadCertificatePage path="/responsables" nom="/responsable" />} ></Route>{/* Add this route */}
              <Route path="participants" element={<ParticipantsPage />} />
              <Route path="add-user" element={<AddUserResponsablePage path="/responsables" />} /> 
              <Route path="evaluation/:evaluationId/questions" element={<QuestionAnswersPage path="/responsables" />} />
              <Route path="action-approval" element={<ApprovalActionsPage />} /> 
              <Route path="courses/:courseId" element={<CoursesPage path="/responsables" nom="/responsable" />} /> {/* Charts Route */}
              <Route path="evaluation-formations/:evaluationId" element={<EvaluationResponsesPage />} /> {/* Charts Route */}
              <Route path="evaluation-formations" element={<EvaluationListPage />} /> {/* Charts Route */}
              <Route path="evaluation-formations/create" element={<CreateEvaluationPage />} /> {/* Charts Route */}
            </Route>
          </Route>

          <Route element={<PrivateRoute roles={['ROLE_CHARGE']} />}>
            <Route path="/charge-formation/chat/*" element={<ChatPage path="/charge-formation" nom="/charge-formation" />} />
            <Route path="/charge-formation" element={<DashboardLayout role="Charge de formation" nom="/charge-formation" />}>
              <Route index element={<Dashboard nom="/charge-formation" path="/charge-formation" />} /> {/* Default Dashboard Route */}
              <Route path="profile" element={<ProfilePage />} /> {/* Charts Route */}
              <Route path="students" element={<StudentsPage path="/charge-formation" />} /> {/* Charts Route */}
              <Route path="courses" element={<CoursesPage path="/charge-formation" nom="/charge-formation" />} /> {/* Charts Route */}
              <Route path="instructors" element={<InstructorsPage path="charge-formation" nom="charge-formation" />} /> {/* Charts Route */}
              <Route path="change-password" element={<ChangePasswordPage />} /> {/* Charts Route */}
              <Route path="courses/add" element={<AddCoursePage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="courses/:courseId/sessions" element={<SessionsPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="sessions" element={<SessionsPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="sessions/add" element={<AddSessionPage  path="/charge-formation" />} />
              <Route path="sessions/edit/:id" element={<EditSessionPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="sections/:sessionId" element={<SectionsPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="sections" element={<SectionsPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="sections/add" element={<AddSectionPage path="/charge-formation" nom="/charge-formation" />} />
              <Route path="sections/edit/:id" element={<EditSectionPage path="/charge-formation" nom="/charge-formation"/>} />
              <Route path="sections/:sectionId/create-quiz" element={<CreateQuizPage nom="/charge-formation" />} />
              <Route path="sections/:sectionId/quiz/:quizId" element={<ViewQuizPage nom="/charge-formation" />} />
              <Route path="quiz/:quizId/edit-quiz" element={<EditQuizPage nom="/charge-formation" />} />
              <Route path="questions/edit/:questionId" element={<EditQuestionPage nom="/charge-formation" />} />
              <Route path="calendar" element={<CalendarPage path="/charge-formation" />} />
              <Route path="courses/:courseId/create-library" element={<CreateLibraryPage />} />
              <Route path="courses/:courseId/library" element={<LibraryPage nom="/charge-formation" user="charge-formation" />} /> // Optional route to manage library
              <Route path="library" element={<LibraryPage path="/charge-formation" nom="/charge-formation" user="charge-formation" />} /> // Optional route to manage library
              <Route path="courses/update/:id" element={<UpdateCoursePage path='/charge-formation' nom = "/charge-formation"/>} />
              <Route path="classes" element={<ClassPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="create-class" element={<CreateClassPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="edit-class/:id" element={<EditClassPage nom="/charge-formation" path="/charge-formation" />} />
              <Route path="latest-evaluations" element={<EvulationPage path="/charge-formation" nom="/charge-formation" />} /> {/* Add this route */}
              <Route path="upload-certificate" element={<UploadCertificatePage path="/charge-formation" nom="/charge-formation" />} ></Route>{/* Add this route */}
              <Route path="participants" element={<ParticipantsPage />} />
              <Route path="add-user" element={<AddUserPage path="/charge-formation" />} />
              <Route path="evaluation/:evaluationId/questions" element={<QuestionAnswersPage path="/charge-formation"/>} />
              <Route path="approvals" element={<ChargeFormationApprovalsPage />} />
              <Route path="courses/:courseId" element={<CoursesPage path="/charge-formation" nom="/charge-formation" />} /> {/* Charts Route */}
            </Route>
          </Route>
          <Route element={<PrivateRoute roles={['ROLE_FORMATEUR']} />}>

            <Route path="/formateur" element={<DashboardLayout role="Formateur" nom="/formateur" />}>
              <Route path="/formateur/chat/*" element={<ChatPage path="/formateurs" nom="/formateur" />} />
              <Route index element={<DashboardFormateur />} /> 
              <Route path="profile" element={<ProfilePage />} /> 
              <Route path="students" element={<StudentsPage path="/formateurs" />} /> 
              <Route path="courses" element={<CoursesPage path="/formateurs" nom="/formateur" />} /> {/* Charts Route */}
              <Route path="change-password" element={<ChangePasswordPage />} /> 
              <Route path="courses/:courseId/sessions" element={<SessionsPage nom="/formateur" path="/formateurs" />} />
              <Route path="sections/:sessionId" element={<SectionsPage nom="/formateur" path="/formateurs" />} />
              <Route path="sections" element={<SectionsPage nom="/formateur" path="/formateurs" />} />
              <Route path="sessions" element={<SessionsPage nom="/formateur" path="/formateurs" />} />
              <Route path="sessions/edit/:id" element={<EditSessionPage nom="/formateur" path="/formateurs" />} />
              <Route path="sections/:sectionId/quiz/:quizId" element={<ViewQuizPage nom="/formateur" />} />
              <Route path="sections/:sectionId/create-quiz" element={<CreateQuizPage nom="/formateur" />} />
              <Route path="quiz/:quizId/edit-quiz" element={<EditQuizPage nom="/formateur" />} />
              <Route path="questions/edit/:questionId" element={<EditQuestionPage nom="/formateur" />} />
              <Route path="calendar" element={<CalendarPage path="/formateurs" />} />
              <Route path="courses/:courseId/create-library" element={<CreateLibraryPage />} />
              <Route path="courses/:courseId/library" element={<LibraryPage nom="/formateur" user="formateur"/>} /> // Optional route to manage library
              <Route path="library" element={<LibraryPage nom="/formateur" user="formateur" path="/formateurs" />} /> // Optional route to manage library
              <Route path="classes" element={<ClassPage nom="/formateur" path="/formateurs" />} />
              <Route path="create-class" element={<CreateClassPage nom="/formateur" path="/formateurs" />} />
              <Route path="edit-class/:id" element={<EditClassPage nom="/formateur" path="/formateurs" />} />
              <Route path="latest-evaluations" element={<EvulationPage path="/formateurs" nom="/formateur" />} /> {/* Add this route */}
              <Route path="sessions/:sessionId/create-conference" element={<CreateConferencePage />} />
              <Route path="evaluation/:evaluationId/questions" element={<QuestionAnswersPage path="/formateur" />} />
              <Route path="evaluation-formations" element={<EvaluationListForUserPage nom="/formateur" role="FORMATEUR" />} />
              <Route path="evaluation-formations/:evaluationId" element={<AnswerEvaluationPage nom="/formateur" />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute roles={['ROLE_PARTICIPANT']} />}>
            <Route path="/participant/chat/*" element={<ChatPage path="/participant" nom="/participant" />} />
            <Route path="/participant" element={<DashboardLayout role="Participant" nom="/participant" />}>
              <Route index element={<DashboardParticipant />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="courses" element={<CoursesPage path="/participants" nom="/participant" />} /> {/* Charts Route */}
              <Route path="change-password" element={<ChangePasswordPage />} />
              <Route path="courses/:courseId/sessions" element={<SessionsPage nom="/participant" path="/participants" />} />
              <Route path="sessions" element={<SessionsPage nom="/participant" path="/participants" />} />
              <Route path="sections/:sessionId" element={<SectionsPage nom="/participant" path="/participants" />} />
              <Route path="sections" element={<SectionsPage nom="/participant" path="/participants" />} />
              <Route path="calendar" element={<CalendarPage path="/participants" />} />
              <Route path="courses/:courseId/library" element={<LibraryPage nom="/participant" />} /> 
              <Route path="library" element={<LibrariesAndResourcesPage />} /> 
              <Route path="classes" element={<ClassPage nom="/participant" path="/participants" />} />
              <Route path="quizes/:quizId/result" element={<ResultPage />} /> 
              <Route path="quizes/:quizId/start-quiz" element={<QuizPage />} />
              <Route path="sessions/:sessionId/conference" element={<ConferencePage />} />
              <Route path="resources" element={<LibrariesAndResourcesPage />} />
              <Route path="evaluations" element={<EvaluationDetails />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="evaluation-formations" element={<EvaluationListForUserPage nom="/participant" role="PARTICIPANT" />} />
              <Route path="evaluation-formations/:evaluationId/answer" element={<AnswerEvaluationPage nom="/participant" />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </EmailProvider>
  );
}

function MainLayout() {
  return (
    <div className='m-0 p-0'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
