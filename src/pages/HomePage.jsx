import { useState, useEffect, useRef } from 'react'
import './HomePage.css'

// ============ 常量定义 ============

const APP_STATES = {
  INITIAL: 'initial',      // 书籍关闭，初始状态
  OPENING: 'opening',      // 打开书籍动画中
  BOOK: 'book',            // 书籍打开，显示封面
  SWITCHING: 'switching',  // 切换封面动画中
  CLOSING: 'closing',      // 关闭书籍动画中
  LOADING: 'loading',      // 加载内容中
  CONTENT: 'content'       // 查看内容详情
}

const ANIMATION_CONFIG = {
  OPENING_DURATION: 200,
  OPENING_FRAME_INTERVAL: 50,
  SWITCHING_DURATION: 200,
  SWITCHING_FRAME_INTERVAL: 66,
  LOAD_TIMEOUT: 10000,
  ERROR_DISPLAY_DURATION: 3000
}

const CONTENTS = [
  {
    id: 'article1',
    title: 'Back View',
    coverImage: '/back-view.webp',
    url: 'http://localhost:3000/zh/back-view'
  },
  {
    id: 'article2',
    title: 'Runtu',
    coverImage: '/rentu.webp',
    url: 'http://localhost:3000/zh/guxiang' // Assuming guxiang is the route based on previous context, or use placeholder
  },
  {
    id: 'article3',
    title: 'Farewell to Cambridge',
    coverImage: '/farewell-to-cambridge.webp',
    url: 'http://localhost:3000/zh/farewell-to-cambridge'
  }
  // 可以添加更多内容
]

// ============ HomePage 组件 ============

const HomePage = () => {
  // === 状态机 ===
  const [appState, setAppState] = useState(APP_STATES.INITIAL)

  // === 内容管理 ===
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [contents] = useState(CONTENTS)

  // === 动画控制 ===
  const [frame, setFrame] = useState(0)
  const [switchDirection, setSwitchDirection] = useState(null) // 'next' | 'prev'

  // === 3D 透视（INITIAL 和 BOOK 状态需要） ===
  const [transform, setTransform] = useState({ rotateY: 0, rotateX: 0 })

  // === 布局变换（书籍居中和缩放） ===
  const [layoutTransform, setLayoutTransform] = useState({ x: 0, y: 0, scale: 1 })

  // === 错误处理 ===
  const [loadError, setLoadError] = useState(null)

  // === 视觉反馈 ===
  const [isBookHovered, setIsBookHovered] = useState(false)

  // === Refs ===
  const containerRef = useRef(null)
  const anchorRef = useRef(null)
  const iframeRef = useRef(null)
  const animationTimerRef = useRef(null)
  const loadTimeoutRef = useRef(null)

  // ============ Helper Functions ============

  // 注意：CLOSING 状态不包含在这里，以便允许用户在关闭过程中再次点击打开（打断关闭）
  const isAnimating = appState === APP_STATES.OPENING || appState === APP_STATES.SWITCHING

  const getCurrentContent = () => contents[currentContentIndex] || null

  const getBookFrameSrc = () => {
    if (appState === APP_STATES.SWITCHING) {
      return `/fanye-${Math.min(frame, 3)}.webp`
    }
    return `/book-${frame}.webp`
  }

  const shouldShowContent = () => {
    // 允许在 OPENING 的最后阶段（frame >= 3）就开始显示内容
    return (appState === APP_STATES.BOOK || appState === APP_STATES.LOADING || appState === APP_STATES.OPENING) && frame >= 3
  }

  const getRotateZ = () => {
    // 翻页动画不需要 Z 轴旋转（开书动画的 Z 轴逻辑会干扰翻页）
    if (appState === APP_STATES.SWITCHING) return 0
    if (frame === 4) return 0
    return (frame / 3) * 20
  }

  // ============ 事件处理器 - 状态转换 ============

  const handleClickBook = (e) => {
    e.stopPropagation()

    // 允许在 INITIAL 状态或 CLOSING 状态（打断关闭）点击
    if (appState !== APP_STATES.INITIAL && appState !== APP_STATES.CLOSING) return

    // 转换到 OPENING 状态
    setAppState(APP_STATES.OPENING)
    setFrame(0)
  }

  const handleOpeningComplete = () => {
    if (appState !== APP_STATES.OPENING) return
    setAppState(APP_STATES.BOOK)
  }

  const handleSwitchContent = (direction) => {
    if (appState !== APP_STATES.BOOK) return

    let nextIndex
    if (direction === 'next') {
      nextIndex = (currentContentIndex + 1) % contents.length
    } else if (direction === 'prev') {
      nextIndex = (currentContentIndex - 1 + contents.length) % contents.length
    }

    if (nextIndex === currentContentIndex) return

    setSwitchDirection(direction)
    setAppState(APP_STATES.SWITCHING)
    setFrame(0)
  }

  const handleSwitchingComplete = () => {
    if (appState !== APP_STATES.SWITCHING) return

    let nextIndex
    if (switchDirection === 'next') {
      nextIndex = (currentContentIndex + 1) % contents.length
    } else if (switchDirection === 'prev') {
      nextIndex = (currentContentIndex - 1 + contents.length) % contents.length
    }

    setCurrentContentIndex(nextIndex)
    setAppState(APP_STATES.BOOK)
    setFrame(4)
    setSwitchDirection(null)
  }

  const handleViewContent = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }

    if (appState !== APP_STATES.BOOK) return

    setLoadError(null)
    setAppState(APP_STATES.LOADING)

    // 启动加载超时 - 使用 ref 来存储超时，避免闭包问题
    const timeout = setTimeout(() => {
      setAppState(prevState => {
        if (prevState === APP_STATES.LOADING) {
          setLoadError('加载超时，请重试')
          setAppState(APP_STATES.BOOK)
          setTimeout(() => {
            setLoadError(null)
          }, ANIMATION_CONFIG.ERROR_DISPLAY_DURATION)
        }
        return prevState
      })
    }, ANIMATION_CONFIG.LOAD_TIMEOUT)

    loadTimeoutRef.current = timeout
  }

  const handleLoadSuccess = () => {
    if (appState !== APP_STATES.LOADING) return

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }

    setAppState(APP_STATES.CONTENT)
  }

  const handleLoadError = (errorMessage) => {
    if (appState !== APP_STATES.LOADING) return

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }

    setLoadError(errorMessage || '加载失败，请重试')
    setAppState(APP_STATES.BOOK)

    // 3s 后自动清除错误
    setTimeout(() => {
      setLoadError(null)
    }, ANIMATION_CONFIG.ERROR_DISPLAY_DURATION)
  }

  const handleCloseContent = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }

    if (appState !== APP_STATES.CONTENT) return

    setAppState(APP_STATES.BOOK)
  }

  const handleCloseBook = () => {
    if (appState !== APP_STATES.BOOK) return

    // 直接重置 layout，CSS transition 会处理平滑移动
    setLayoutTransform({ x: 0, y: 0, scale: 1 })
    setAppState(APP_STATES.CLOSING)
    // frame 将在 useEffect 中从 4 递减到 0
  }

  const handleBackgroundClick = () => {
    if (appState === APP_STATES.BOOK) {
      handleCloseBook()
    } else if (appState === APP_STATES.CONTENT) {
      handleCloseContent(new Event('click'))
    }
  }

  // ============ 事件处理器 - 输入反馈 ============

  const handleBookMouseEnter = () => {
    if (appState === APP_STATES.INITIAL) {
      setIsBookHovered(true)
    }
  }

  const handleBookMouseLeave = () => {
    setIsBookHovered(false)
  }

  // ============ Effects - 动画系统 ============

  // 计算打开动画的目标参数
  const openingTargetRef = useRef(null)

  useEffect(() => {
    if (appState !== APP_STATES.OPENING) return

    if (!anchorRef.current) return

    const rect = anchorRef.current.getBoundingClientRect()
    const targetHeight = window.innerHeight * 0.9
    const targetScale = targetHeight / rect.height

    const targetX = window.innerWidth / 2
    const targetY = window.innerHeight / 2
    const currentX = rect.left + rect.width / 2
    const currentY = rect.top + rect.height / 2

    const x = targetX - currentX
    const y = targetY - currentY

    // 使用 requestAnimationFrame 确保过渡从当前状态平滑开始，避免突变
    // 先确保当前帧是初始状态
    requestAnimationFrame(() => {
      setLayoutTransform({ x, y, scale: targetScale })
    })
  }, [appState])

  // 移除了基于 frame 更新 layoutTransform 的 useEffect，改为 CSS 动画

  // OPENING 动画帧计时器
  useEffect(() => {
    if (appState !== APP_STATES.OPENING) return

    const frameInterval = ANIMATION_CONFIG.OPENING_FRAME_INTERVAL
    let currentFrame = 0

    const timer = setInterval(() => {
      currentFrame++
      setFrame(currentFrame)

      if (currentFrame >= 4) {
        clearInterval(timer)
        handleOpeningComplete()
      }
    }, frameInterval)

    return () => clearInterval(timer)
  }, [appState])

  // CLOSING 动画帧计时器
  useEffect(() => {
    if (appState !== APP_STATES.CLOSING) return

    const frameInterval = ANIMATION_CONFIG.OPENING_FRAME_INTERVAL
    let currentFrame = 4

    const timer = setInterval(() => {
      currentFrame--
      setFrame(currentFrame)

      if (currentFrame <= 0) {
        clearInterval(timer)
        setAppState(APP_STATES.INITIAL)
        setFrame(0)
      }
    }, frameInterval)

    return () => clearInterval(timer)
  }, [appState])

  // SWITCHING 动画
  useEffect(() => {
    if (appState !== APP_STATES.SWITCHING) return

    const frameInterval = 120 // Slowed down from 66 to 120 for visibility
    const totalFrames = 4 // 0, 1, 2, 3
    let currentFlipIndex = 0

    const timer = setInterval(() => {
      currentFlipIndex++

      // Update visual state!
      if (currentFlipIndex < totalFrames) {
        setFrame(currentFlipIndex)
      }

      if (currentFlipIndex >= totalFrames) {
        clearInterval(timer)
        handleSwitchingComplete()
      }
    }, frameInterval)

    return () => clearInterval(timer)
  }, [appState, switchDirection])

  // 3D 透视追踪（INITIAL 和 BOOK 状态）
  useEffect(() => {
    if (appState !== APP_STATES.INITIAL && appState !== APP_STATES.BOOK) return

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) - 0.5
      const y = (e.clientY / innerHeight) - 0.5

      const rotateY = x * 10
      const rotateX = -y * 6

      setTransform({ rotateY, rotateX })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [appState])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating) return

      if (appState === APP_STATES.BOOK) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          handleSwitchContent('prev')
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          handleSwitchContent('next')
        } else if (e.key === 'Enter') {
          e.preventDefault()
          handleViewContent(e)
        } else if (e.key === 'Escape') {
          e.preventDefault()
          handleCloseBook()
        }
      } else if (appState === APP_STATES.CONTENT) {
        if (e.key === 'Escape') {
          e.preventDefault()
          handleCloseContent(e)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [appState, isAnimating])

  // 窗口大小调整处理
  useEffect(() => {
    const handleResize = () => {
      if ((appState === APP_STATES.BOOK || appState === APP_STATES.CONTENT) && layoutTransform.scale > 1) {
        // 如果书籍已展开，重新计算位置
        if (!anchorRef.current) return
        const rect = anchorRef.current.getBoundingClientRect()
        const targetHeight = window.innerHeight * 0.9
        const scale = targetHeight / rect.height

        const targetX = window.innerWidth / 2
        const targetY = window.innerHeight / 2
        const currentX = rect.left + rect.width / 2
        const currentY = rect.top + rect.height / 2

        const x = targetX - currentX
        const y = targetY - currentY

        setLayoutTransform({ x, y, scale })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [appState, layoutTransform.scale])

  // 清理工作 - 组件卸载时
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
    }
  }, [])

  // ============ CSS 类名计算 ============

  const getBookContainerClasses = () => {
    const classes = ['book-container']

    if (isAnimating) {
      classes.push('animating')
    }

    if (appState === APP_STATES.INITIAL) {
      classes.push('breathing')
    }

    if (appState === APP_STATES.BOOK && isBookHovered) {
      classes.push('hover-enhanced')
    }

    return classes.join(' ')
  }

  // ============ 渲染 ============

  return (
    <div className="home-page" ref={containerRef} onClick={handleBackgroundClick}>
      {/* 背景场景 */}
      <div className="image-container">
        <img
          src="/table.webp"
          alt="Table"
          className="table-image"
        />

        {/* 书籍容器 - 在 CONTENT 状态下隐藏 */}
        {appState !== APP_STATES.CONTENT && (
          <div className="book-anchor" ref={anchorRef}>
            <div
              className={getBookContainerClasses()}
              onClick={handleClickBook}
              onMouseEnter={handleBookMouseEnter}
              onMouseLeave={handleBookMouseLeave}
              style={{
                transform: `translate(${layoutTransform.x}px, ${layoutTransform.y}px) scale(${layoutTransform.scale})`
              }}
            >
              <div
                className="book-rotator"
                style={{
                  transform: `perspective(1000px) rotateY(${transform.rotateY}deg) rotateX(${transform.rotateX}deg) rotateZ(${getRotateZ()}deg)`,
                  transition: frame === 4 ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                {/* 书籍打开/切换动画帧 */}
                {[0, 1, 2, 3, 4].map((index) => (
                  <img
                    key={`book-${index}`}
                    src={`/book-${index}.webp`}
                    alt={`Book Frame ${index}`}
                    className={`book-image-layer ${index === frame && appState !== APP_STATES.SWITCHING ? 'visible' : ''}`}
                  />
                ))}

                {/* 翻页动画帧（SWITCHING 状态） */}
                {appState === APP_STATES.SWITCHING && (
                  <img
                    key={`fanye-${frame}`}
                    src={`/fanye-${Math.min(frame, 3)}.webp`}
                    alt={`Flip Frame ${frame}`}
                    className="flip-animation-layer visible"
                  />
                )}

                {/* 书籍背景（内容打开时显示） */}
                <div
                  className={`book-content-bg ${shouldShowContent() ? 'visible' : ''}`}
                />

                {/* 当前内容的封面 */}
                {getCurrentContent() && (
                  <img
                    src={getCurrentContent().coverImage}
                    alt="Book Cover"
                    className={`book-content-image ${shouldShowContent() ? 'visible' : ''}`}
                    onClick={handleViewContent}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>

              {/* 只在 BOOK 状态显示导航按钮 */}
              {appState === APP_STATES.BOOK && contents.length > 1 && (
                <div className="navigation-buttons">
                  <button
                    className="nav-button nav-prev"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSwitchContent('prev')
                    }}
                    aria-label="Previous article"
                  >
                    ◀
                  </button>
                  <button
                    className="nav-button nav-next transparent-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSwitchContent('next')
                    }}
                    aria-label="Next article"
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 加载指示器 */}


      {/* 错误提示 */}
      {loadError && (
        <div className="error-toast">
          {loadError}
        </div>
      )}

      {/* 内容详情覆盖层（iframe） */}
      {/* 内容详情覆盖层（iframe） */}
      {(appState === APP_STATES.CONTENT || appState === APP_STATES.LOADING) && getCurrentContent() && (
        <div className={`back-view-overlay ${appState === APP_STATES.CONTENT ? 'active' : ''}`} onClick={handleCloseContent}>

          {/* 加载指示器 - 移到这里，在 overlay 内部显示 */}
          {appState === APP_STATES.LOADING && (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
          )}

          <div
            className={`iframe-container ${appState === APP_STATES.CONTENT ? 'visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={{ opacity: appState === APP_STATES.CONTENT ? 1 : 0 }}
          >
            <button
              className="close-button"
              onClick={handleCloseContent}
              aria-label="Close content"
            >
              ✕
            </button>
            <iframe
              ref={iframeRef}
              src={getCurrentContent().url}
              title={getCurrentContent().title}
              className="content-iframe"
              onLoad={handleLoadSuccess}
              onError={() => handleLoadError('加载失败')}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
