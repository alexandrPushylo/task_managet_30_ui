import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TaskManager from './TaskManager';
import {Provider} from 'react-redux'
import {store} from "./store/store";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient()
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <TaskManager/>

                <ReactQueryDevtools initialIsOpen={false} />
            </Provider>
        </QueryClientProvider>

    </React.StrictMode>
);

