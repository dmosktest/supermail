package rate

import (
	"sync"
	"time"
)

type Limiter struct {
	mu       sync.Mutex
	interval time.Duration
	last     map[string]time.Time
}

func New(interval time.Duration) *Limiter {
	return &Limiter{interval: interval, last: map[string]time.Time{}}
}

func (l *Limiter) Allow(key string) (bool, time.Duration) {
	now := time.Now()
	l.mu.Lock()
	defer l.mu.Unlock()
	if t, ok := l.last[key]; ok {
		left := l.interval - now.Sub(t)
		if left > 0 {
			return false, left
		}
	}
	l.last[key] = now
	if len(l.last) > 10000 {
		for k, t := range l.last {
			if now.Sub(t) > l.interval*2 {
				delete(l.last, k)
			}
		}
	}
	return true, 0
}
