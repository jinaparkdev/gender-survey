import {useState} from 'react'
import {ChevronRight, Share2} from 'lucide-react'
import emailjs from '@emailjs/browser'
import './SurveyApp.css'

interface Option {
    label: string
    text: string
    value: number
}

interface Question {
    id: number
    title: string
    image: string
    options: Option[]
}

interface ResultType {
    label: string
    desc: string
}

type stageType = 'intro' | 'info' | 'survey' | 'result'

const emailOptions = {
    publicKey: import.meta.env.VITE_EMAIL_SERVICE_PUBLIC_KEY,
    blockHeadless: true,
    limitRate: {
        throttle: 5000
    }
}

const SurveyApp = () => {
    const [stage, setStage] = useState<stageType>('intro')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [score, setScore] = useState(0)
    const [gender, setGender] = useState<string>('')
    const [ageGroup, setAgeGroup] = useState<string>('')

    const questions: Question[] = [
        {
            id: 1,
            title: "회사 채용공고에 '여성 우대' 딱지가 붙어있어. 어떻게 생각해?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q1",
            options: [
                {label: "A", text: "왜 그런 정책이 생겼는지 통계랑 배경 찾아보고 의견 말하기", value: 0},
                {label: "B", text: "공정한지, 법적으로 문제 없는지 따져보기", value: 1},
                {label: "C", text: "이건 역차별 아냐? 실력으로 뽑아야지", value: 2},
                {label: "D", text: "SNS에 비꼬는 짤 올리고 공유하기", value: 3}
            ]
        },
        {
            id: 2,
            title: "군가산점 다시 만들자는 청원이 떴어. 너라면?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q2",
            options: [
                {label: "A", text: "군복무 대신 다른 혜택 줄 방법 같이 고민해보자", value: 0},
                {label: "B", text: "공정한지 여러 입장 들어보고 토론하기", value: 1},
                {label: "C", text: "당연히 바로 부활시켜야지!", value: 2},
                {label: "D", text: "반대하는 사람들 비웃으면서 무조건 찬성 서명", value: 3}
            ]
        },
        {
            id: 3,
            title: "온라인 커뮤니티에 여자 비하하는 짤이 올라왔어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q3",
            options: [
                {label: "A", text: "신고 누르고 그 사람 차단", value: 0},
                {label: "B", text: "그냥 스크롤 넘기기", value: 1},
                {label: "C", text: "표현의 자유잖아, 별거 아니야", value: 2},
                {label: "D", text: "웃기다며 퍼 나르고 댓글 달기", value: 3}
            ]
        },
        {
            id: 4,
            title: "여대를 남녀공학으로 바꾸자는 얘기가 나왔어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q4",
            options: [
                {label: "A", text: "학생들 의견 먼저 듣고, 안전시설 점검부터 하자", value: 0},
                {label: "B", text: "공개토론이나 투표로 민주적으로 결정하기", value: 1},
                {label: "C", text: "이제 여대 필요 없지, 바로 공학 전환해", value: 2},
                {label: "D", text: "여대 보존해야 한다고 하는 학생들 조롱하기", value: 3}
            ]
        },
        {
            id: 5,
            title: "데이트할 때 돈 누가 내야 하냐로 친구들이 싸워. 너 생각은?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q5",
            options: [
                {label: "A", text: "둘이 얘기해서 정하거나, 수입 차이 고려해서 내기", value: 0},
                {label: "B", text: "오늘 내가, 다음엔 네가 이렇게 번갈아 내기", value: 1},
                {label: "C", text: "남자가 내는 게 당연한 거 아냐? 그 정도는 해줘야지", value: 2},
                {label: "D", text: "여자가 돈 안 내면 김치녀라며 조롱 영상 만들기", value: 3}
            ]
        },
        {
            id: 6,
            title: "여성가족부 없애자는 뉴스가 떴어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q6",
            options: [
                {label: "A", text: "필요한 기능은 다른 부처로 옮기고 제대로 재설계하기", value: 0},
                {label: "B", text: "일단 시범적으로 해보고 결과 보고 판단하기", value: 1},
                {label: "C", text: "당장 폐지해", value: 2},
                {label: "D", text: "혐오 짤 만들어서 SNS에 도배하기", value: 3}
            ]
        },
        {
            id: 7,
            title: "데이트 폭력 기사가 떴는데 댓글이 난리야",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q7",
            options: [
                {label: "A", text: "피해자 보호하면서 정확한 수사도 같이 해야 함", value: 0},
                {label: "B", text: "일단 경찰 조사 결과 나올 때까지 기다리기", value: 1},
                {label: "C", text: "또 무고 아냐? 의심부터 하기", value: 2},
                {label: "D", text: "피해자한테 악플 달고 비웃기", value: 3}
            ]
        },
        {
            id: 8,
            title: "'여성만' 참가할 수 있는 공모전이 있어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q8",
            options: [
                {label: "A", text: "성차별때문에 사회적 장벽이 높으니 필요해", value: 0},
                {label: "B", text: "특정 분야에 한해서, 특정 기간동안만 제한적으로 해야해", value: 1},
                {label: "C", text: "이거 역차별 아냐? 남자는 왜 안 돼?", value: 2},
                {label: "D", text: "주최 측 조롱하고 불매운동 하기", value: 3}
            ]
        },
        {
            id: 9,
            title: "단톡방에서 여자 외모 평가하다가 걸렸어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q9",
            options: [
                {label: "A", text: "사과하고 다시는 안 그러겠다고 약속해야지", value: 0},
                {label: "B", text: "그 단톡방 없애버리면 되잖아", value: 1},
                {label: "C", text: "장난인데 뭐... 너무 민감하게 구는 거 아냐?", value: 2},
                {label: "D", text: "오히려 그 사건 비웃으면서 2차 가해 하기", value: 3}
            ]
        },
        {
            id: 10,
            title: "정치인이 \"남녀갈등은 언론이 만든 거다\"라고 했어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q10",
            options: [
                {label: "A", text: "언론도 있지만 사회구조, 세대, SNS 등 여러 원인 복합적", value: 0},
                {label: "B", text: "어느 정도 맞는 말인데 증거 좀 더 보여줘", value: 1},
                {label: "C", text: "맞아, 다 언론 때문이야", value: 2},
                {label: "D", text: "그 언론사들 공격하고 악플 달기", value: 3}
            ]
        },
        {
            id: 11,
            title: "지하철에 여성전용칸을 만든다던데?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q11",
            options: [
                {label: "A", text: "출퇴근 시간대에만 시범 운영하고, 혼잡 완화 대책도 강구해야지", value: 0},
                {label: "B", text: "일정 기간 해보고 이용률이랑 범죄율 보고 다시 결정하자", value: 1},
                {label: "C", text: "이거 역차별이니까 반대야", value: 2},
                {label: "D", text: "빈 칸 특혜라며 비꼬는 짤 만들기", value: 3}
            ]
        },
        {
            id: 12,
            title: "유튜브가 극단적인 남초 채널 계속 추천해줘",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q12",
            options: [
                {label: "A", text: "신고하고 관심 없음 누르기", value: 0},
                {label: "B", text: "팩트체크 하면서 시청하기", value: 1},
                {label: "C", text: "내 경험이랑 비슷한데? 완전 공감하고 믿기", value: 2},
                {label: "D", text: "영상 편집해서 SNS에 퍼뜨리기", value: 3}
            ]
        },
        {
            id: 13,
            title: "수업에서 \"페미니즘은 남녀가 동등한 권리 갖자는 거다\" 발표했어. 너는?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q13",
            options: [
                {label: "A", text: "완전 동의! 추가 자료도 찾아서 같이 얘기하기", value: 0},
                {label: "B", text: "대체로 맞는 말인데 자료 좀 더 보고 싶어", value: 1},
                {label: "C", text: "글쎄... 역차별 문제도 있지 않아?", value: 2},
                {label: "D", text: "페미니즘은 여성우월주의라며 비난하기", value: 3}
            ]
        },
        {
            id: 14,
            title: "\"페미니즘 덕분에 한국 여성 지위가 나아졌다\"는 기사 토론",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q14",
            options: [
                {label: "A", text: "맞아, 투표권이나 교육권 같은 구체적 예시 들기", value: 0},
                {label: "B", text: "어느 정도 맞는데 분야마다 다르긴 해", value: 1},
                {label: "C", text: "별로 기여한 거 없는 것 같은데?", value: 2},
                {label: "D", text: "전혀 아니고 오히려 해로워", value: 3}
            ]
        },
        {
            id: 15,
            title: "회의 중에 누가 \"페미니즘은 여자를 피해자로만 본다\"고 했어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q15",
            options: [
                {label: "A", text: "그건 왜곡이야, 원래 의미 설명해주기", value: 0},
                {label: "B", text: "좀 과장된 표현인 것 같아, 정정 부탁하기", value: 1},
                {label: "C", text: "어느 정도는 맞는 말인 것 같아", value: 2},
                {label: "D", text: "완전 공감하고 SNS에 퍼뜨리기", value: 3}
            ]
        },
        {
            id: 16,
            title: "커뮤니티에 \"페미니즘=여성우월주의\" 짤이 돌고 있어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q16",
            options: [
                {label: "A", text: "잘못된 정보라고 반박하고 제대로 된 자료 올리기", value: 0},
                {label: "B", text: "너무 극단적인 일반화 아니냐고 지적하기", value: 1},
                {label: "C", text: "어느 정도 맞는 말이라며 공유하기", value: 2},
                {label: "D", text: "맞다고 동의하며 적극적으로 퍼뜨리기", value: 3}
            ]
        },
        {
            id: 17,
            title: "친구가 \"너 페미니스트야?\" 물어봤어",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q17",
            options: [
                {label: "A", text: "응, 페미니스트야", value: 0},
                {label: "B", text: "그 단어는 안 쓰는데 남녀평등은 찬성해", value: 1},
                {label: "C", text: "페미니즘이라는 말 자체가 좀 불편해", value: 2},
                {label: "D", text: "페미? 진짜 싫어", value: 3}
            ]
        },
        {
            id: 18,
            title: "회사에서 '성평등 주간' 캠페인 하자는데",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q18",
            options: [
                {label: "A", text: "좋아! 적극 참여하고 다른 사람들도 같이 하자고 말하기", value: 0},
                {label: "B", text: "시간 되면 참여하기", value: 1},
                {label: "C", text: "굳이 필요한가? 별 효과 없을 것 같은데", value: 2},
                {label: "D", text: "반대하고 비꼬는 콘텐츠 만들기", value: 3}
            ]
        }
    ]

    const getResultType = (score: number): ResultType => {
        if (score <= 25) return {
            label: "개방형",
            desc: "다양한 관점을 존중하며 성평등 이슈에 개방적인 태도를 보입니다. 대화와 이해를 중시하는 성향입니다."
        }
        if (score <= 50) return {
            label: "신중형",
            desc: "성평등 이슈에 신중하게 접근하며 균형잡힌 시각을 유지하려 노력합니다. 상황에 따라 유연한 판단을 보입니다."
        }
        if (score <= 75) return {
            label: "방어형",
            desc: "성평등 이슈에 경계심을 갖고 있으며 역차별에 대한 우려가 있습니다. 현재 구조에 대한 불만을 표현합니다."
        }
        return {label: "대립형", desc: "성평등 담론에 강한 반감을 보이며 대립적 태도를 취합니다. 극단적 표현이나 조롱에 동조하는 경향이 있습니다."}
    }

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({...prev, [questionId]: value}))
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            calculateScore()
        }
    }

    const calculateScore = async () => {
        const total = Object.values(answers).reduce((sum: number, val: number) => sum + val, 0)
        const finalScore = Math.round((total / (3 * questions.length)) * 100)
        setScore(finalScore)
        setStage('result')

        // 결과 계산 후 자동으로 이메일 전송
        await sendEmailWithScore(finalScore)
    }

    const sendEmailWithScore = async (finalScore: number) => {
        const resultType = getResultType(finalScore)

        const answersDetail = questions.map(q => {
            const answerValue = answers[q.id]
            const selectedOption = q.options.find(opt => opt.value === answerValue)
            if (!selectedOption) return ''
            return `Q${q.id}. ${q.title}\n답변: ${selectedOption.label}. ${selectedOption.text}`
        }).join('\n\n')

        const templateParams = {
            title: '설문',
            fromName: '설문참여자',
            time: new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}),
            message: `성별: ${gender}\n연령대: ${ageGroup}\n총 점수: ${finalScore}\n결과 유형: ${resultType.label}\n\n상세 답변:\n${answersDetail}`,
            email: 'jina940323@noreply.com'
        }

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAIL_SERVICE_ID,
                import.meta.env.VITE_EMAIL_SERVICE_TEMPLATE_ID,
                templateParams,
                import.meta.env.VITE_EMAIL_SERVICE_PUBLIC_KEY
            )
            console.log('이메일이 자동으로 전송되었습니다.')
        } catch (error) {
            console.error('이메일 전송 실패:', error)
        }
    }


    const handleShare = async () => {
        const resultType = getResultType(score)
        const text = `젠더 인식 설문 결과: ${resultType.label} (${score}점)`

        if (navigator.share) {
            try {
                await navigator.share({title: '젠더 인식 설문', text, url: window.location.href})
            } catch {
                console.log('공유 취소됨')
            }
        } else {
            alert('이 브라우저는 공유 기능을 지원하지 않습니다.')
        }
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100
    const currentQ = questions[currentQuestion]
    const isAnswered = answers[currentQ?.id] !== undefined

    if (stage === 'intro') {
        return (
            <div className="survey-center-container">
                <div className="survey-card">
                    <h1 className="intro-title">
                        이대남 테스트
                    </h1>
                    <div className="intro-description">
                        <p>나의 이대남 지수는 몇 점일까?</p>
                    </div>
                    <button
                        onClick={() => setStage('info')}
                        className="btn-primary"
                    >
                        시작하기
                        <ChevronRight size={20}/>
                    </button>
                    <div className="organizer-info">
                        <div className="organizer-names">
                            <span>경기도</span>
                            <span className="organizer-divider">•</span>
                            <span>경기시민연구소울림</span>
                            <span className="organizer-divider">•</span>
                            <span>청년향유연구소</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (stage === 'info') {
        return (
            <div className="survey-center-container">
                <div className="survey-card">
                    <h1 className="intro-title">
                        기본 정보 입력
                    </h1>
                    <div className="intro-description">
                        <p>설문 진행을 위해 기본 정보를 선택해주세요.</p>
                    </div>

                    <div style={{ marginTop: '2rem', width: '100%' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                                성별
                            </h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {['남성', '여성', '기타', '선택 안 함'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setGender(option)}
                                        className={`option-button ${gender === option ? 'option-button-selected' : ''}`}
                                        style={{ flex: '1 1 calc(50% - 0.375rem)', minWidth: '120px' }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                                연령대
                            </h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {['10대', '20대', '30대', '40대', '50대 이상'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setAgeGroup(option)}
                                        className={`option-button ${ageGroup === option ? 'option-button-selected' : ''}`}
                                        style={{ flex: '1 1 calc(50% - 0.375rem)', minWidth: '120px' }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setStage('survey')}
                        disabled={!gender || !ageGroup}
                        className={gender && ageGroup ? 'btn-primary' : 'btn-disabled'}
                        style={{ marginTop: '1rem' }}
                    >
                        설문 시작하기
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>
        )
    }

    if (stage === 'result') {
        const resultType = getResultType(score)
        return (
            <div className="survey-center-container">
                <div className="survey-card">
                    <div className="result-score">
                        <div className="result-score-number">{score}</div>
                        <div className="result-type">
                            {resultType.label}
                        </div>
                        <p className="result-description">
                            {resultType.desc}
                        </p>
                    </div>
                    <div className="button-group">
                        <button
                            onClick={handleShare}
                            className="btn-primary"
                        >
                            <Share2 size={20}/>
                            결과 공유하기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    emailjs.init(emailOptions)

    return (
        <div className="survey-container">
            <div className="progress-header">
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{width: `${progress}%`}}/>
                </div>
                <div className="progress-text">
                    {currentQuestion + 1} / {questions.length}
                </div>
            </div>

            <div className="question-container">
                <div className="question-card">
                    {/*<img*/}
                    {/*    src={currentQ.image}*/}
                    {/*    alt={`질문 ${currentQ.id}`}*/}
                    {/*    className="question-image"*/}
                    {/*/>*/}

                    <div className="question-content">
                        <h2 className="question-title">
                            {currentQ.title}
                        </h2>

                        <div className="options-container">
                            {currentQ.options.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={() => handleAnswer(currentQ.id, option.value)}
                                    className={`option-button ${
                                        answers[currentQ.id] === option.value
                                            ? 'option-button-selected'
                                            : ''
                                    }`}
                                >
                                    <span
                                        className="option-label">{option.label}.</span> {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bottom-nav">
                <div className="bottom-nav-inner">
                    <button
                        onClick={handleNext}
                        disabled={!isAnswered}
                        className={isAnswered ? 'btn-primary' : 'btn-disabled'}
                    >
                        {currentQuestion < questions.length - 1 ? '다음' : '결과 보기'}
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SurveyApp
