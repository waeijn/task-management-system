<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::get('tasks/summary', [TaskController::class, 'summary']);
Route::apiResource('tasks', TaskController::class);