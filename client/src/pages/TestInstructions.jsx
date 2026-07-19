import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { ShieldCheck, Clock3, AlertTriangle, Play } from 'lucide-react';

function TestInstructions() {
const { id } = useParams();
const navigate = useNavigate();
const [test, setTest] = useState(null);

useEffect(() => {
async function fetchTest() {
const snap = await getDoc(doc(db, 'tests', id));

  if (snap.exists()) {
    setTest({
      id: snap.id,
      ...snap.data(),
    });
  }
}

fetchTest();

}, [id]);

if (!test) {
return <div className="text-center py-24">Loading...</div>;
}

return ( <div className="max-w-4xl mx-auto py-10 space-y-8"> <div className="card-theme rounded-3xl p-8 shadow-xl border border-theme"> <div className="flex items-center gap-3 mb-6"> <ShieldCheck className="text-blue-600" size={32} /> <div> <h1 className="text-3xl font-bold">{test.title}</h1> <p className="text-theme-muted">Please read all instructions carefully before starting the test.</p> </div> </div>

    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="surface-secondary rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <Clock3 className="text-blue-500" size={22} />
          <h3 className="font-semibold">Duration</h3>
        </div>
        <p className="text-2xl font-bold">{test.duration} Minutes</p>
      </div>

      <div className="surface-secondary rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="text-orange-500" size={22} />
          <h3 className="font-semibold">Questions</h3>
        </div>
        <p className="text-2xl font-bold">{test.questions?.length || 0}</p>
      </div>
    </div>

    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Exam Rules</h2>

      <div className="space-y-3 text-theme leading-7">
        <div className="flex gap-3">
          <span className="text-blue-600 font-bold">1.</span>
          <p>Once the test starts, the timer will continue even if you leave the page.</p>
        </div>

        <div className="flex gap-3">
          <span className="text-blue-600 font-bold">2.</span>
          <p>Do not switch tabs, minimize the browser, or leave the test window during the exam.</p>
        </div>

        <div className="flex gap-3">
          <span className="text-blue-600 font-bold">3.</span>
          <p>You will receive a maximum of <strong>3 warnings</strong> for leaving the test window.</p>
        </div>

        <div className="flex gap-3">
          <span className="text-blue-600 font-bold">4.</span>
          <p>After the third warning, the test will be automatically submitted and cannot be resumed.</p>
        </div>

        <div className="flex gap-3">
          <span className="text-blue-600 font-bold">5.</span>
          <p>Use the Question Navigator to move between questions and review your answers before submission.</p>
        </div>

        <div className="flex gap-3">
          <span className="text-blue-600 font-bold">6.</span>
          <p>Make sure you have a stable internet connection before starting the exam.</p>
        </div>
      </div>
    </div>

    <div className="primary-soft primary-border border rounded-2xl p-5 mt-8">
      <p className="font-semibold primary-text">
        By clicking <strong>Start Test</strong>, you agree to follow all exam rules and understand that repeated violations will result in automatic submission.
      </p>
    </div>

    <div className="flex justify-end mt-8">
      <button
        onClick={() => navigate(`/dashboard/tests/${id}`)}
        className="btn-primary px-8 py-3 rounded-xl flex items-center gap-3 shadow-lg shadow-blue-500/20"
      >
        <Play size={20} />
        Start Test
      </button>
    </div>
  </div>
</div>

);
}

export default TestInstructions;
