<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TaskController extends Controller
{
    // GET /api/tasks — with optional filtering
    public function index(Request $request)
    {
        $query = Task::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by view type
        if ($request->has('view')) {
            $today = Carbon::today()->toDateString();

            if ($request->view === 'due_today') {
                $query->where('due_date', $today);
            } elseif ($request->view === 'overdue') {
                $query->where('due_date', '<', $today)
                      ->where('status', '!=', 'completed');
            }
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // GET /api/tasks/summary — counts for sidebar
    public function summary()
    {
        $today = Carbon::today()->toDateString();

        $tasks = Task::all();

        // Status counts
        $statusCounts = $tasks->groupBy('status')->map->count();

        // Category counts
        $categoryCounts = $tasks->whereNotNull('category')
                               ->where('category', '!=', '')
                               ->groupBy('category')
                               ->map->count();

        // Priority counts
        $priorityCounts = $tasks->groupBy('priority')->map->count();

        // View counts
        $dueToday = Task::where('due_date', $today)->count();
        $overdue = Task::where('due_date', '<', $today)
                       ->where('status', '!=', 'completed')
                       ->count();

        return response()->json([
            'total' => $tasks->count(),
            'due_today' => $dueToday,
            'overdue' => $overdue,
            'status' => $statusCounts,
            'categories' => $categoryCounts,
            'priorities' => $priorityCounts,
        ]);
    }

    // POST /api/tasks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in-progress,completed',
            'due_date' => 'nullable|date',
            'category' => 'nullable|string|max:100',
            'priority' => 'in:low,medium,high',
        ]);

        $task = Task::create($validated);
        return response()->json($task, 201);
    }

    // GET /api/tasks/{id}
    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json($task);
    }

    // PUT /api/tasks/{id}
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in-progress,completed',
            'due_date' => 'nullable|date',
            'category' => 'nullable|string|max:100',
            'priority' => 'in:low,medium,high',
        ]);

        $task->update($validated);
        return response()->json($task);
    }

    // DELETE /api/tasks/{id}
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
