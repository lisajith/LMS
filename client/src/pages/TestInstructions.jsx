import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  ShieldCheck,
  Clock3,
  AlertTriangle,
  Play,
  Maximize2,
  CheckCircle2,
} from "lucide-react";

function TestInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [fullscreenAccepted, setFullscreenAccepted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTest() {
      try {
        const testRef = doc(db, "tests", id);
        const testSnap = await getDoc(testRef);

        if (testSnap.exists()) {
          setTest({
            id: testSnap.id,
            ...testSnap.data(),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchTest();
  }, [id]);

  // Detect fullscreen changes
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
  }, []);

  async function requestFullscreen() {
    try {
      setLoading(true);

      await document.documentElement.requestFullscreen();

      setFullscreenAccepted(true);
    } catch (err) {
      console.error(err);
      alert("Fullscreen permission is required to start the test.");
    } finally {
      setLoading(false);
    }
  }

  function startTest() {
    navigate(`/dashboard/tests/attempt/${id}`);
  }

  if (!test) {
    return <div className="text-center py-24">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="card-theme rounded-3xl p-8 shadow-xl border border-theme">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <ShieldCheck className="text-blue-600" size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">{test.title}</h1>
            <p className="text-theme-muted mt-1">
              Secure examination mode is required for this test.
            </p>
          </div>
        </div>

        {/* Test Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="surface-secondary rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock3 className="text-blue-500" size={22} />
              <h3 className="font-semibold">Duration</h3>
            </div>
            <p className="text-2xl font-bold">
              {test.duration} Minutes
            </p>
          </div>

          <div className="surface-secondary rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-orange-500" size={22} />
              <h3 className="font-semibold">Questions</h3>
            </div>
            <p className="text-2xl font-bold">
              {test.questions?.length || 0}
            </p>
          </div>
        </div>

        {/* Rules */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Important Exam Rules</h2>

          <div className="space-y-3 text-theme leading-7">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <p>
                The test must be taken in <strong>fullscreen mode</strong>.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <p>
                Switching tabs, minimizing the browser, or exiting fullscreen
                will trigger a violation warning.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <p>
                You have a maximum of <strong>3 warnings</strong>.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <p>
                After the third warning, the test will be automatically
                submitted.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">5.</span>
              <p>
                Once started, the timer continues even if the page is refreshed.
              </p>
            </div>
          </div>
        </div>

        {/* Fullscreen Requirement */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <Maximize2 className="text-blue-600" size={24} />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                Fullscreen is mandatory
              </h3>

              <p className="text-theme mb-4">
                Click the button below to enter fullscreen mode. The test can
                only be started after fullscreen is successfully enabled.
              </p>

              <div className="flex items-center gap-2 text-sm">
                {isFullscreen ? (
                  <>
                    <CheckCircle2
                      className="text-green-600"
                      size={18}
                    />
                    <span className="text-green-700 dark:text-green-400 font-semibold">
                      Fullscreen mode is active
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle
                      className="text-orange-500"
                      size={18}
                    />
                    <span className="text-orange-700 dark:text-orange-400 font-medium">
                      Fullscreen is not enabled
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          {!fullscreenAccepted ? (
            <button
              onClick={requestFullscreen}
              disabled={loading}
              className="btn-primary px-8 py-3 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 disabled:opacity-60"
            >
              <Maximize2 size={20} />
              {loading ? "Requesting Fullscreen..." : "Accept & Continue"}
            </button>
          ) : (
            <button
              onClick={startTest}
              disabled={!isFullscreen}
              className="btn-primary px-8 py-3 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} />
              Start Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestInstructions;