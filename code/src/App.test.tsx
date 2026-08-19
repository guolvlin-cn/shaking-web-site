import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './routes';

describe('App 路由骨架', () => {
  it('访问 / 渲染首页', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-home')).toBeInTheDocument();
  });

  it('访问 /about 渲染关于页', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-about')).toBeInTheDocument();
  });

  it('访问未知路径重定向到首页', async () => {
    render(
      <MemoryRouter initialEntries={['/not-exist']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-home')).toBeInTheDocument();
  });

  it('访问 /works 渲染作品合集页', async () => {
    render(
      <MemoryRouter initialEntries={['/works']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-works')).toBeInTheDocument();
  });
});
