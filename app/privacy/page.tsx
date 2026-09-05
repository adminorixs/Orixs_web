import { Navbar } from '../../components/Navbar';
import { FooterSection } from '../../components/FooterSection';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const sections = [
  {
    title: '1. Who We Are',
    body: (
      <>
        Orixs and askOrixs.ai are operated by Trusphere Technologies Private
        Limited (&quot;Orixs&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). Orixs provides business
        operating platforms, workspace tools, and AI copilot features for teams
        using modules such as CRM, work management, finance, HR, payroll,
        recruitment, support, email, calendar, and reporting.
      </>
    ),
  },
  {
    title: '2. Scope Of This Policy',
    body: (
      <>
        This Privacy Policy explains how we collect, use, store, share, and
        protect information when you use orixs.io, askOrixs.ai, our SaaS
        applications, our AI copilot, and connected integrations including
        Google Sign-In, Gmail, and Google Calendar.
      </>
    ),
  },
  {
    title: '3. Information We Collect',
    body: (
      <>
        We collect information you provide directly, information created while
        using the platform, and information received from integrations you
        connect. This may include account profile details, business contact
        details, company and workspace data, CRM records, project records,
        forms, invoices, expenses, payments, attendance, leave, payroll-related
        records, recruitment records, tickets, notices, files, messages,
        calendar events, usage logs, device information, browser information,
        IP address, cookies, support messages, and billing or subscription
        information.
      </>
    ),
  },
  {
    title: '4. Google Sign-In Data',
    body: (
      <>
        If you choose to sign in with Google, we may receive your Google account
        identifier, name, email address, profile image, and authentication
        tokens needed to securely sign you in. We use this information only to
        authenticate your account, prevent unauthorized access, and connect your
        Orixs workspace to the correct user profile. We do not receive or store
        your Google password.
      </>
    ),
  },
  {
    title: '5. Gmail And Calendar Data',
    body: (
      <>
        If you separately connect Gmail or Google Calendar features, Orixs may
        access the Google data required for the features you enable. Gmail data
        may include email address, message metadata, message content, labels,
        threads, attachments, drafts, and sent messages where needed to show,
        search, summarize, draft, send, or sync mailbox activity. Calendar data
        may include calendar lists, event titles, attendees, dates, times,
        locations, descriptions, and meeting details where needed to show,
        create, update, or sync calendar events. These integrations are optional
        and can be disconnected by the user or workspace administrator.
      </>
    ),
  },
  {
    title: '6. How We Use Information',
    body: (
      <>
        We use information to provide and secure the platform, create and manage
        user accounts, operate enabled modules, process user requests, sync
        connected integrations, provide AI copilot responses and actions,
        personalize workspace context, send service notices, provide support,
        detect abuse, maintain audit logs, improve reliability, process billing,
        comply with legal obligations, and enforce our terms.
      </>
    ),
  },
  {
    title: '7. AI Copilot Processing',
    body: (
      <>
        When you use Orixs AI or askOrixs.ai, your prompt, workspace context,
        selected records, and relevant module data may be processed to answer
        your request or perform an action. The copilot can read, create, update,
        or delete records only according to your account permissions, company
        workspace boundaries, enabled modules, and confirmation rules. High-risk
        actions such as sending emails, deleting records, approvals, payroll, or
        other sensitive changes require confirmation before execution.
      </>
    ),
  },
  {
    title: '8. Google API Limited Use Disclosure',
    body: (
      <>
        Orixs&apos; use and transfer of information received from Google APIs will
        adhere to the{' '}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          className="text-purple-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. We use Google user data only
        to provide or improve user-facing features that you request or enable,
        such as Google Sign-In, mailbox sync, email drafting or sending,
        calendar sync, workspace search, summaries, and copilot actions. We do
        not sell Google user data. We do not use Google user data for
        advertising. We do not use Google Workspace API data to train or improve
        generalized AI or machine learning models. Human access to Google user
        data is limited to cases where you ask us for support, where access is
        required for security or abuse investigation, or where required by law.
      </>
    ),
  },
  {
    title: '9. How We Share Information',
    body: (
      <>
        We may share information with service providers that help us operate the
        platform, including hosting, database, storage, analytics, payment,
        email delivery, customer support, security, and AI infrastructure
        providers. These providers are allowed to process information only as
        needed to provide services to Orixs and must protect it under
        appropriate confidentiality and security obligations. We may also share
        information when required by law, to protect rights and safety, during a
        business transfer, or when you direct us to share data through an
        integration or workspace action.
      </>
    ),
  },
  {
    title: '10. Data Storage And Retention',
    body: (
      <>
        We retain account, workspace, and integration data for as long as needed
        to provide the services, comply with legal obligations, resolve
        disputes, maintain security, and enforce agreements. OAuth tokens for
        Google integrations are retained only while the integration remains
        connected or as otherwise needed for security and audit purposes. Audit
        logs may be retained to preserve security, compliance, and operational
        history. When data is no longer needed, we delete it or de-identify it
        according to our retention practices.
      </>
    ),
  },
  {
    title: '11. Your Choices And Controls',
    body: (
      <>
        You may access, update, export, or request deletion of your personal
        information by using available account settings or contacting us. You
        can disconnect Google integrations inside Orixs where the feature is
        available, or revoke Orixs access from your Google Account permissions
        page. Workspace administrators may control user access, modules,
        permissions, and retention settings for their organization. You may opt
        out of marketing communications while still receiving important service
        or security messages.
      </>
    ),
  },
  {
    title: '12. Security',
    body: (
      <>
        We use administrative, technical, and organizational safeguards designed
        to protect information from unauthorized access, loss, misuse, or
        alteration. These safeguards may include HTTPS, access controls,
        tenant-level company scoping, role permissions, audit logs, token
        protection, secure deployment practices, monitoring, and restricted
        access to production systems. No method of transmission or storage is
        completely secure, but we work to protect your information in line with
        the sensitivity of the data we process.
      </>
    ),
  },
  {
    title: '13. International Transfers',
    body: (
      <>
        Orixs may process and store information in countries other than the
        country where you are located. Where required, we use appropriate
        safeguards for international transfers and process information according
        to this Privacy Policy.
      </>
    ),
  },
  {
    title: '14. Children',
    body: (
      <>
        Orixs is intended for business users and is not directed to children. We
        do not knowingly collect personal information from children under the
        age required by applicable law. If we learn that a child has provided
        personal information without appropriate consent, we will take steps to
        delete it.
      </>
    ),
  },
  {
    title: '15. Changes To This Policy',
    body: (
      <>
        We may update this Privacy Policy from time to time. If we make material
        changes, we will provide notice through the website, application, email,
        or another appropriate method. If a change affects how we use Google
        user data, we will request any required consent before using that data
        for a new purpose.
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-20 pb-0 flex flex-col">
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 py-16 flex-1">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 mb-3">Last updated: September 5, 2026</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4">Privacy Policy for Orixs and askOrixs.ai</h1>
          <p className="text-lg text-gray-700 leading-8">
            This policy is written to clearly explain how Orixs handles user,
            workspace, Google, and AI copilot data across our website and SaaS
            applications.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 text-gray-800 text-base md:text-lg leading-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-slate-950 mb-2">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <section>
            <h2 className="text-xl font-bold text-slate-950 mb-2">16. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, Google data,
              account deletion, or your privacy choices, contact us at{' '}
              <a href="mailto:contact@askOrixs.ai" className="text-purple-600 underline">
                contact@askOrixs.ai
              </a>
              .
            </p>
          </section>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
