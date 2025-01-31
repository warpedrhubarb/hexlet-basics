// @ts-check

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Countdown from 'react-countdown';
import { format } from 'date-fns';

import { actions } from '../slices/index.js';
import { getLanguage } from '../utils/editorUtils.js';
import { solutionStates } from '../utils/maps.js';
import EntityContext from '../EntityContext.js';
import waitingClock from '../../../assets/images/waiting_clock.png';

function Solution() {
  const { language, lessonVersion } = useContext(EntityContext);
  const { editor, solution } = useSelector((state) => ({
    editor: state.editorSlice,
    solution: state.solutionSlice,
  }));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const renderUserCode = () => {
    if (!editor.content) {
      return <p className="mt-3">{t('userCodeInstructions')}</p>;
    }

    return (
      <div>
        <h2 className="h3">{t('userCode')}</h2>
        <SyntaxHighlighter showLineNumbers language={[getLanguage(language)]}>
          {editor.content}
        </SyntaxHighlighter>
      </div>
    );
  };

  const renderSolution = () => (
    <div className="p-lg-3 hexlet-basics-content" id="basics-solution">
      <h2 className="h3">{t('teacherSolution')}</h2>
      <SyntaxHighlighter language={[getLanguage(language)]}>
        {lessonVersion.original_code}
      </SyntaxHighlighter>
      {renderUserCode()}
    </div>
  );

  const handleShowSolution = () => {
    dispatch(actions.changeSolutionProcessState({ processState: solutionStates.shown }));
  };

  const renderShowButton = () => (
    <>
      <p>{t('solutionNotice')}</p>
      <div className="text-center">
        <button
          type="button"
          className="btn btn-secondary px-4"
          onClick={handleShowSolution}
        >
          {t('showSolution')}
        </button>
      </div>
    </>
  );

  const renderContent = (countdownData) => {
    const { completed } = countdownData;

    if (completed || solutionStates.canBeShown === solution.processState) {
      return renderShowButton();
    }

    const remainingTime = format(new Date(countdownData.total), 'mm:ss');

    return (
      <div className="text-center">
        <p className="lead">{t('solutionInstructions')}</p>
        <div className="display-4">{ remainingTime }</div>
        <img className="img-fluid px-5" src={waitingClock} alt="waiting_clock" />
      </div>
    );
  };

  return (
    <div>
      {solutionStates.shown === solution.processState
        ? renderSolution()
        : <Countdown date={solution.startTime + solution.waitingTime} renderer={renderContent} />}
    </div>
  );
}

export default Solution;
