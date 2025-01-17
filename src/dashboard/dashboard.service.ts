import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Patient } from '../patient/schemas/patient.schema';
import { Prescription } from '../prescription/schemas/prescription.schema';
import { DashboardConfig } from './schemas/dashboard.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(DashboardConfig.name) private dashboardConfigModel: Model<DashboardConfig>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Prescription.name) private prescriptionModel: Model<Prescription>,
  ) {}

  async getDashboardStats(user: User): Promise<any> {
    // console.log(user)
    switch (user.role) {
      case 'doctor':
        return this.getDoctorStats(user._id);
      case 'nurse':
        return this.getNurseStats(user._id);
      case 'pharmacist':
        return this.getPharmacistStats(user._id);
      case 'admin':
        return this.getAdminStats();
      default:
        throw new Error('Role not supported');
    }
  }

  private async getDoctorStats(doctorId: ObjectId) {
    const totalPatients = await this.patientModel.countDocuments({ managedBy: doctorId });
    const pendingSurgeries = await this.patientModel.countDocuments({ alerts: 'Requires Surgery' });
    const issuedPrescriptions = await this.prescriptionModel.countDocuments({ issuedBy: doctorId });
    return {
      totalPatients,
      pendingSurgeries,
      issuedPrescriptions,
    };
  }

  private async getNurseStats(nurseId: ObjectId) {
    const assignedPatients = await this.patientModel.countDocuments({ nurseAssigned: nurseId });
    const criticalPatients = await this.patientModel.countDocuments({ alerts: 'Critical Vitals' });
    return {
      assignedPatients,
      criticalPatients,
    };
  }

  private async getPharmacistStats(pharmacistId: ObjectId) {
    const pendingPrescriptions = await this.prescriptionModel.countDocuments({ isDispensed: false });
    const inventoryRestockAlerts = await this.prescriptionModel.countDocuments({ alerts: 'Low Inventory' });
    return {
      pendingPrescriptions,
      inventoryRestockAlerts,
    };
  }

  private async getAdminStats() {
    const totalUsers = await this.patientModel.estimatedDocumentCount();
    const totalPatients = await this.patientModel.estimatedDocumentCount();
    const activeSessions = await this.getActiveSessions(); // Custom implementation.
    return {
      totalUsers,
      totalPatients,
      activeSessions,
    };
  }

  private async getActiveSessions(): Promise<number> {
    // Example placeholder logic for active sessions
    return Math.floor(Math.random() * 100); // Replace with actual session tracking logic.
  }


  async fetchDashboardMetrics() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalPatients,
      healthStatusBreakdown,
      patientAssignments,
      ageDistribution,
      alertsByCategory,
      dailyAdmissions,
      weeklyAdmissions,
      monthlyAdmissions,
      dischargedPatients,
      admittedPatients,
      criticalAlerts,
    ] = await Promise.all([
      // 1. Total Patients (KPI)
      this.patientModel.countDocuments(),

      // 2. Health Status Breakdown
      this.patientModel.aggregate([
        { $group: { _id: '$healthStatus', count: { $sum: 1 } } },
      ]),

      // 3. Patient Assignments to Medical Staff
      this.patientModel.aggregate([
        {
          $group: {
            _id: null,
            doctors: { $sum: { $cond: [{ $ifNull: ['$assignedDoctor', false] }, 1, 0] } },
            nurses: { $sum: { $cond: [{ $ifNull: ['$assignedNurse', false] }, 1, 0] } },
            pharmacists: { $sum: { $cond: [{ $ifNull: ['$assignedPharmacist', false] }, 1, 0] } },
            mlsSessions: { $sum: { $cond: [{ $ifNull: ['$assignedMLSSession', false] }, 1, 0] } },
          },
        },
      ]),

      // 4. Age Distribution
      this.patientModel.aggregate([
        {
          $bucket: {
            groupBy: '$age',
            boundaries: [0, 18, 35, 60, 100, 130],
            default: 'Unknown',
            output: { count: { $sum: 1 } },
          },
        },
      ]),

      // 5. Alerts by Category
      this.patientModel.aggregate([
        { $unwind: '$alerts' },
        { $group: { _id: '$alerts', count: { $sum: 1 } } },
      ]),

      // 6. Daily Admissions (Line Graph)
      this.patientModel.countDocuments({ 'admittedStatus.timeIn': { $gte: startOfDay } }),

      // 7. Weekly Admissions (Line Graph)
      this.patientModel.countDocuments({ 'admittedStatus.timeIn': { $gte: startOfWeek } }),

      // 8. Monthly Admissions (Line Graph)
      this.patientModel.countDocuments({ 'admittedStatus.timeIn': { $gte: startOfMonth } }),

      // 9. Active Patients (KPI)
      this.patientModel.countDocuments({ 'admittedStatus.in': false }),

      // 10. Admitted Patients (KPI)
      this.patientModel.countDocuments({ 'admittedStatus.in': true }),

      // 11. Critical Alerts (KPI)
      this.patientModel.countDocuments({ alerts: { $in: ['Critical Vitals', 'Emergency Room'] } }),
    ]);

    return {
      KPIs: {
        totalPatients,
        dischargedPatients,
        admittedPatients,
        criticalAlerts,
      },
      healthStatusBreakdown,
      patientAssignments: patientAssignments[0] || { doctors: 0, nurses: 0, pharmacists: 0, mlsSessions: 0 },
      ageDistribution,
      alertsByCategory,
      lineGraphs: {
        dailyAdmissions,
        weeklyAdmissions,
        monthlyAdmissions,
      },
    };
  }
}
